import { Body, Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import { Client } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';
import { ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UserEntity } from './database/user.entity';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private client: ClientKafka;

  async onModuleInit() {
    const requestPatterns = ['find-all-users', 'create-user'];
    requestPatterns.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  @Post()
  @ApiBody({ type: UserDto })
  create(@Body() user: UserDto): Observable<UserEntity> {
    return this.client.send('create-user', user);
  }

  @Get()
  findAll(): Observable<UserEntity[]> {
    return this.client.send('find-all-users', {});
  }
}
