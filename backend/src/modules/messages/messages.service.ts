import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../../shared/services/email/email.service';
import { CreateMessageDto } from './dto/create-message.dto';

// Type-safe include objects for Prisma queries
const conversationIncludes = {
  messages: {
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          ownerProfile: { select: { avatarUrl: true } },
          providerProfile: { select: { businessName: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  owner: { 
    select: { 
      id: true, 
      name: true, 
      ownerProfile: { select: { avatarUrl: true } } 
    } 
  },
  provider: { 
    select: { 
      id: true, 
      name: true, 
      ownerProfile: { select: { avatarUrl: true } },
      providerProfile: { select: { businessName: true } }
    } 
  },
  job: {
    include: {
      request: { select: { title: true } },
    },
  },
} satisfies Prisma.ConversationInclude;

type ConversationWithIncludes = Prisma.ConversationGetPayload<{ include: typeof conversationIncludes }>;

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Get or create a conversation for a job
   */
  async getOrCreateConversation(jobId: string, userId: string) {
    // Verify user has access to this job
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        owner: { 
          select: { 
            id: true, 
            name: true, 
            ownerProfile: { select: { avatarUrl: true } } 
          } 
        },
        provider: { 
          select: { 
            id: true, 
            name: true, 
            ownerProfile: { select: { avatarUrl: true } },
            providerProfile: { select: { businessName: true } } 
          } 
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    if (job.ownerId !== userId && job.providerId !== userId) {
      throw new ForbiddenException('Access denied: You are not part of this conversation');
    }

    // Check if conversation already exists
    let conversation: ConversationWithIncludes | null = await this.prisma.conversation.findUnique({
      where: { jobId },
      include: conversationIncludes,
    });

    if (!conversation) {
      // Create new conversation
      conversation = await this.prisma.conversation.create({
        data: {
          jobId,
          ownerId: job.ownerId,
          providerId: job.providerId,
        },
        include: conversationIncludes,
      });

      this.logger.log(`Created new conversation ${conversation.id} for job ${jobId}`);
    }

    // Map response for frontend compatibility
    const owner = {
      ...conversation.owner,
      avatarUrl: conversation.owner.ownerProfile?.avatarUrl,
      ownerProfile: undefined
    };
    
    const provider = {
      ...conversation.provider,
      avatarUrl: conversation.provider.ownerProfile?.avatarUrl,
      businessName: conversation.provider.providerProfile?.businessName,
      ownerProfile: undefined,
      providerProfile: undefined
    };

    const messages = conversation.messages.map((msg) => ({
      ...msg,
      sender: {
        ...msg.sender,
        avatarUrl: msg.sender.ownerProfile?.avatarUrl,
        businessName: msg.sender.providerProfile?.businessName,
        ownerProfile: undefined,
        providerProfile: undefined
      }
    }));

    return {
      ...conversation,
      owner,
      provider,
      messages
    };
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(createMessageDto: CreateMessageDto, senderId: string) {
    const { jobId, content } = createMessageDto;

    // Get or create conversation
    const conversation = await this.getOrCreateConversation(jobId, senderId);

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            ownerProfile: { select: { avatarUrl: true } },
            providerProfile: { select: { businessName: true } },
          },
        },
      },
    });

    // Update conversation's lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    this.logger.log(`Message sent in conversation ${conversation.id}`);

    // Send email notification to recipient
    const recipientId = conversation.ownerId === senderId ? conversation.providerId : conversation.ownerId;
    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: { email: true, name: true },
    });

    if (recipient) {
      const messagePreview = content.length > 100 ? content.substring(0, 100) : content;
      const senderData = message.sender as any;
      const senderName = senderData.providerProfile?.businessName || senderData.name;
      
      await this.emailService.sendNewMessageEmail({
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        senderName,
        messagePreview,
        conversationId: conversation.id,
      });
    }

    // Map sender for flattened response
    const sender = {
      ...message.sender,
      avatarUrl: (message.sender as any).ownerProfile?.avatarUrl,
      businessName: (message.sender as any).providerProfile?.businessName,
      ownerProfile: undefined,
      providerProfile: undefined
    };

    return {
      ...message,
      sender,
      conversationId: conversation.id,
      recipientId: conversation.ownerId === senderId ? conversation.providerId : conversation.ownerId,
    };
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { providerId: userId },
        ],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                ownerProfile: {
                  select: { avatarUrl: true }
                },
              },
            },
          },
        },
        owner: { 
          select: { 
            id: true, 
            name: true, 
            ownerProfile: {
              select: { avatarUrl: true }
            }
          } 
        },
        provider: { 
          select: { 
            id: true, 
            name: true,
            ownerProfile: {
              select: { avatarUrl: true }
            },
            providerProfile: {
              select: { businessName: true }
            }
          } 
        },
        job: {
          include: {
            request: { select: { title: true, vehicle: { select: { make: true, model: true, year: true } } } },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return conversations.map((conv) => {
      // Map nested profiles to flat properties for compatibility
      const owner = {
        ...conv.owner,
        avatarUrl: conv.owner.ownerProfile?.avatarUrl,
        ownerProfile: undefined // Hide from output
      };
      
      const provider = {
        ...conv.provider,
        avatarUrl: conv.provider.ownerProfile?.avatarUrl,
        businessName: conv.provider.providerProfile?.businessName,
        ownerProfile: undefined,
        providerProfile: undefined
      };

      const lastMessage = conv.messages[0] ? {
        ...conv.messages[0],
        sender: {
          ...conv.messages[0].sender,
          avatarUrl: conv.messages[0].sender.ownerProfile?.avatarUrl,
          ownerProfile: undefined
        }
      } : null;

      return {
        ...conv,
        owner,
        provider,
        unreadCount: conv._count.messages,
        lastMessage,
        otherUser: conv.ownerId === userId ? provider : owner,
      };
    });
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(jobId: string, userId: string) {
    const conversation = await this.getOrCreateConversation(jobId, userId);

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return conversation;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }
}
