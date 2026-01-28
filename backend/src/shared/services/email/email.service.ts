import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { passwordResetTemplate } from './password-reset.template';
import { emailVerificationTemplate } from './email-verification.template';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * EmailService handles all email notifications using Resend
 * 
 * Provides methods for sending transactional emails for:
 * - Quote notifications
 * - Job status updates
 * - Message notifications
 * - Review reminders
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'onboarding@resend.dev');
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY is not set. Emails will be logged only.');
    }
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
    const isDevelopment = !this.resend;
    
    if (isDevelopment) {
      this.logger.log(`[DEV-MOCK] Password Reset Email for ${to}`);
      this.logger.log(`[DEV-MOCK] Reset Link: ${resetUrl}`);
      // Log full HTML content in verbose mode or just acknowledgment
      return true;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Reset your password',
        html: passwordResetTemplate(resetUrl),
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}:`, error);
      return false;
    }
  }

  async sendVerificationEmail(to: string, verificationUrl: string): Promise<boolean> {
    const isDevelopment = !this.resend;
    
    if (isDevelopment) {
      this.logger.log(`[DEV-MOCK] Verification Email for ${to}`);
      this.logger.log(`[DEV-MOCK] Verify Link: ${verificationUrl}`);
      return true;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Verify your email',
        html: emailVerificationTemplate(verificationUrl),
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}:`, error);
      return false;
    }
  }


  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.resend) {
      this.logger.warn('Email service not configured - skipping email send');
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        this.logger.error('Failed to send email:', error);
        throw new Error(`Email send failed: ${error.message}`);
      }

      this.logger.log(`Email sent successfully: ${data?.id}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      // Don't throw - email failures shouldn't break the app
    }
  }

  /**
   * Send notification when a new quote is received
   */
  async sendQuoteReceivedEmail(data: {
    ownerEmail: string;
    ownerName: string;
    providerName: string;
    requestTitle: string;
    amount: string;
    estimatedDuration: string;
    requestId: string;
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Quote Received</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Quote Received! 🎉</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.ownerName},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Great news! <strong>${data.providerName}</strong> has sent you a quote for your service request:
            </p>
            
            <div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 20px;">${data.requestTitle}</h2>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280; font-size: 14px;">Quote Amount:</span>
                <strong style="font-size: 18px; color: #10b981;">$${data.amount}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280; font-size: 14px;">Estimated Duration:</span>
                <strong style="font-size: 14px;">${data.estimatedDuration}</strong>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 25px;">
              Review the full quote details, compare with other quotes, and accept when you're ready.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/owner/requests/${data.requestId}" 
                 style="background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                View Quote
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">
              Best regards,<br>
              <strong>The Service Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
            <p>You received this email because you have a service request on Service Connect.</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.ownerEmail,
      subject: `New Quote: $${data.amount} for ${data.requestTitle}`,
      html,
    });
  }

  /**
   * Send notification when a quote is accepted
   */
  async sendQuoteAcceptedEmail(data: {
    providerEmail: string;
    providerName: string;
    ownerName: string;
    requestTitle: string;
    amount: string;
    jobId: string;
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Quote Accepted</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Quote Accepted! 🎊</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.providerName},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Congratulations! <strong>${data.ownerName}</strong> has accepted your quote.
            </p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h2 style="margin: 0 0 15px 0; color: #059669; font-size: 20px;">${data.requestTitle}</h2>
              <div style="margin-bottom: 10px;">
                <span style="color: #6b7280; font-size: 14px;">Job Amount:</span>
                <strong style="font-size: 18px; color: #10b981; margin-left: 10px;">$${data.amount}</strong>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 25px;">
              The job has been scheduled. View the job details to coordinate with the customer.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/provider/jobs/${data.jobId}" 
                 style="background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                View Job Details
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">
              Best regards,<br>
              <strong>The Service Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
            <p>You received this email because you're a service provider on Service Connect.</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.providerEmail,
      subject: `Quote Accepted: ${data.requestTitle}`,
      html,
    });
  }

  /**
   * Send notification when job status changes
   */
  async sendJobStatusUpdateEmail(data: {
    recipientEmail: string;
    recipientName: string;
    jobTitle: string;
    oldStatus: string;
    newStatus: string;
    jobId: string;
    isOwner: boolean;
  }): Promise<void> {
    const statusEmojis: Record<string, string> = {
      scheduled: '📅',
      in_progress: '🔧',
      completed: '✅',
      cancelled: '❌',
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Job Status Update</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Job Status Updated ${statusEmojis[data.newStatus] || '📢'}</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.recipientName},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Your job status has been updated:
            </p>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">${data.jobTitle}</h2>
              <div style="margin-bottom: 10px;">
                <span style="color: #6b7280; font-size: 14px;">Status:</span>
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 10px; text-transform: uppercase;">
                  ${data.newStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/${data.isOwner ? 'owner' : 'provider'}/jobs/${data.jobId}" 
                 style="background: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                View Job
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">
              Best regards,<br>
              <strong>The Service Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
            <p>You received this email about your job on Service Connect.</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.recipientEmail,
      subject: `Job ${data.newStatus.replace('_', ' ')}: ${data.jobTitle}`,
      html,
    });
  }

  /**
   * Send notification when a new message is received
   */
  async sendNewMessageEmail(data: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    messagePreview: string;
    conversationId: string;
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Message 💬</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.recipientName},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              <strong>${data.senderName}</strong> sent you a message:
            </p>
            
            <div style="background: #faf5ff; border-left: 4px solid #8b5cf6; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 15px; color: #4c1d95; font-style: italic;">
                "${data.messagePreview}${data.messagePreview.length > 100 ? '...' : ''}"
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/messages?conversation=${data.conversationId}" 
                 style="background: #8b5cf6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                Reply to Message
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">
              Best regards,<br>
              <strong>The Service Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
            <p>You received this email because you have a conversation on Service Connect.</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.recipientEmail,
      subject: `New message from ${data.senderName}`,
      html,
    });
  }

  /**
   * Send review reminder after job completion
   */
  async sendReviewReminderEmail(data: {
    ownerEmail: string;
    ownerName: string;
    providerName: string;
    jobTitle: string;
    jobId: string;
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Leave a Review</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">How was your service? ⭐</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.ownerName},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Your job with <strong>${data.providerName}</strong> has been completed. We'd love to hear about your experience!
            </p>
            
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h2 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px;">${data.jobTitle}</h2>
              <p style="margin: 0; color: #78350f; font-size: 14px;">
                Your feedback helps other customers make informed decisions and helps providers improve their service.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/owner/jobs/${data.jobId}" 
                 style="background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                Leave a Review
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">
              Best regards,<br>
              <strong>The Service Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
            <p>You received this email because you recently completed a job on Service Connect.</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.ownerEmail,
      subject: `How was your service with ${data.providerName}?`,
      html,
    });
  }
}
