import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Parts')
@Controller('parts')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Add a part to inventory' })
  @ApiResponse({ status: 201, description: 'Part created successfully' })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreatePartDto) {
    return this.partsService.create(req.user.id, dto);
  }

  @Get('my-inventory')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Get provider inventory' })
  getMyInventory(@Request() req: AuthenticatedRequest) {
    return this.partsService.findByProvider(req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Remove a part' })
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.partsService.remove(req.user.id, id);
  }
}



