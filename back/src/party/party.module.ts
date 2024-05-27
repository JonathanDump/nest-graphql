import { Module } from '@nestjs/common';
import { ChatGateway } from './party.gateway';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
