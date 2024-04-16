import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { RagModule } from './rag/rag.module';

@Module({
  imports: [BotModule, RagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
