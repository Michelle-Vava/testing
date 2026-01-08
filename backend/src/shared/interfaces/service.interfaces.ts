/**
 * Storage Service Interface
 * 
 * Abstraction layer for cloud storage providers.
 * Allows easy switching between Cloudinary, S3, Azure Blob, etc.
 */
export interface IStorageService {
  /**
   * Upload a single file
   * @param file - File buffer from upload
   * @param folder - Destination folder/path
   * @returns Public URL of uploaded file
   */
  uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;

  /**
   * Upload multiple files
   * @param files - Array of file buffers
   * @param folder - Destination folder/path
   * @returns Array of public URLs
   */
  uploadFiles(files: Express.Multer.File[], folder?: string): Promise<string[]>;

  /**
   * Delete a file by URL
   * @param url - Public URL of the file
   */
  deleteFile(url: string): Promise<void>;

  /**
   * Delete multiple files
   * @param urls - Array of public URLs
   */
  deleteFiles(urls: string[]): Promise<void>;
}

/**
 * Email Service Interface
 * 
 * Abstraction for email providers (Resend, SendGrid, AWS SES, etc.)
 */
export interface IEmailService {
  /**
   * Send a generic email
   */
  sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<void>;

  /**
   * Send transactional emails with templates
   */
  sendTemplateEmail(template: string, data: Record<string, any>): Promise<void>;
}

/**
 * Payment Service Interface
 * 
 * Abstraction for payment providers (Stripe, PayPal, Square, etc.)
 */
export interface IPaymentService {
  /**
   * Create a payment intent
   */
  createPaymentIntent(amount: number, metadata?: Record<string, any>): Promise<string>;

  /**
   * Confirm a payment
   */
  confirmPayment(paymentIntentId: string): Promise<boolean>;

  /**
   * Refund a payment
   */
  refundPayment(paymentIntentId: string, amount?: number): Promise<boolean>;

  /**
   * Get payment status
   */
  getPaymentStatus(paymentIntentId: string): Promise<string>;
}
