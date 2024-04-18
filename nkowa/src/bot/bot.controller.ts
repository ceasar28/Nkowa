import { Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';
import { RagService } from 'src/rag/rag.service';

@Controller('bot')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly ragService: RagService,
  ) {}

  //   @Post()
  //   async linkPdf(@Body() linkData: {url,nkowaId})
}
