import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { MessagesGateway } from './messages.gateway';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private messagesGateway: MessagesGateway,
  ) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for the authenticated user' })
  async getConversations(@Request() req: AuthenticatedRequest) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('conversations/:jobId')
  @ApiOperation({ summary: 'Get messages for a specific job conversation' })
  async getConversation(@Request() req: AuthenticatedRequest, @Param('jobId') jobId: string) {
    return this.messagesService.getMessages(jobId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Send a message in a conversation' })
  async sendMessage(@Request() req: AuthenticatedRequest, @Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.sendMessage(createMessageDto, req.user.id);
    
    // Emit via WebSocket
    this.messagesGateway.sendMessageToUser(message.recipientId, 'newMessage', message);
    
    return message;
  }

  @Post('conversations/:conversationId/read')
  @ApiOperation({ summary: 'Mark all messages in a conversation as read' })
  async markAsRead(
    @Request() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.markAsRead(conversationId, req.user.id);
  }
}



