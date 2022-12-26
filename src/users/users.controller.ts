import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() user: User): User {
    return this.userService.create(user);
  }

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }
}
