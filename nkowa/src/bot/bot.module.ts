import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { DatabaseModule } from 'src/database/database.module';
import { RagModule } from 'src/rag/rag.module';

@Module({
  controllers: [BotController],
  providers: [BotService],
  imports: [DatabaseModule, RagModule],
})
export class BotModule {}
