import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, dto);
  }
}