import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { RagModule } from './rag/rag.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BotModule, RagModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
