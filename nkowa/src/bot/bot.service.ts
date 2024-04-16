import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { welcomeMessage } from './Markups/welcome';
import { convert } from 'html-to-text';
@Injectable()
export class BotService {
  private readonly bot: TelegramBot;
  private logger = new Logger(BotService.name);

  constructor() {
    this.bot = new TelegramBot(
      '7080447298:AAEPhCEaj5Ih2iLk1F1hAnoC2sMClJDkbqY',
      { polling: true },
    );
    // event listerner for incomning messages
    this.bot.on('message', this.handleRecievedMessages);

    // event Listerner for button requests
    this.bot.on('callback_query', this.handleButtonCommands);
  }

  handleRecievedMessages = async (msg: any) => {
    this.logger.debug(msg);
    try {
      const command = msg.text.toLowerCase();
      console.log('Command :', command);
      if (command === '/start') {
        const username = `${msg.from.first_name} ${msg.from.last_name}`;
        const welcome = await welcomeMessage(username);
        if (welcome) {
          const replyMarkup = {
            inline_keyboard: welcome.keyboard,
          };
          await this.bot.sendMessage(msg.chat.id, welcome.message, {
            reply_markup: replyMarkup,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleButtonCommands = async (msg: any) => {};
}
