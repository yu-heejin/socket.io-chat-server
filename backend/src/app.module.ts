import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatEventGateway } from './app.event.gateway';
import { AppService } from './app.service';

@Module({
  imports: [ChatEventGateway],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
