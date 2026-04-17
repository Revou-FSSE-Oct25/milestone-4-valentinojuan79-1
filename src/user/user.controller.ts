import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, dto);
  }
}