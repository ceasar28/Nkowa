import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { welcomeMessageMarkup, allFeaturesMarkup, pdFDetails } from './Markups';
import { DatabaseService } from 'src/database/database.service';
import { RagService } from 'src/rag/rag.service';
// import { convert } from 'html-to-text';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

@Injectable()
export class BotService {
  private readonly bot: TelegramBot;
  private logger = new Logger(BotService.name);
  private pdfUrlUploadPrompt = {};

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly ragService: RagService,
  ) {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    // event listerner for incomning messages
    this.bot.on('message', this.handleRecievedMessages);

    // event Listerner for button requests
    this.bot.on('callback_query', this.handleButtonCommands);
  }

  handleRecievedMessages = async (msg: any) => {
    this.logger.debug(msg);
    try {
      const command = msg.text;
      console.log('Command :', command);
      if (command === '/start') {
        const username = `${msg.from.first_name} ${msg.from.last_name}`;
        const welcome = await welcomeMessageMarkup(username);
        if (welcome) {
          const replyMarkup = {
            inline_keyboard: welcome.keyboard,
          };
          await this.bot.sendMessage(msg.chat.id, welcome.message, {
            reply_markup: replyMarkup,
          });
        }
      } else {
        if (this.pdfUrlUploadPrompt[msg.chat.id]) {
          const uploadUrl = await this.ragService.uploadPDFUrl(
            command,
            msg.chat.id,
          );
          if (uploadUrl) {
            console.log('API CALL :', uploadUrl);
            if (uploadUrl['message']) {
              await this.bot.sendMessage(
                msg.chat.id,
                `❌ Error: ${uploadUrl.message}, Please use a viewable PDF url`,
              );
            } else {
              const detail = await pdFDetails(
                uploadUrl['name'],
                uploadUrl['url'],
                uploadUrl['sourceId'],
              );
              if (detail) {
                const Markup = {
                  inline_keyboard: detail.keyboard,
                };
                await this.bot.sendMessage(msg.chat.id, detail.title, {
                  reply_markup: Markup,
                });
                delete this.pdfUrlUploadPrompt[msg.chat.id];
                return;
              }
              return;
            }
            return;
          }
          return;
          console.log('this is a user URL');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleButtonCommands = async (query: any) => {
    this.logger.debug(query);
    let command: string;
    let sourceId: string;
    const first_name = query.from.first_name;
    const last_name = query.from.last_name;
    // const user_Id = query.from.id;
    const username = `${first_name} ${last_name}`;

    // function to check if query.data is a json type
    function isJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }

    if (isJSON(query.data)) {
      command = JSON.parse(query.data).command;
      sourceId = JSON.parse(query.data).sourceId;
    } else {
      command = query.data;
    }

    const chatId = query.message.chat.id;
    // const userId = query.from.id;

    try {
      switch (command) {
        case '/getStarted':
          await this.sendAllFeature(chatId, username);
          return;

        case '/fileUploadUrl':
          await this.fileUploadByUrlPrompt(chatId);
          return;

        case '/summary':
          try {
            const summary = await this.ragService.getSummary(sourceId);
            if (summary) {
              return this.bot.sendMessage(chatId, summary.summary);
            } else {
              return this.bot.sendMessage(chatId, 'Error processing summary');
            }
          } catch (error) {
            console.log(error);
          }

        default:
          return await this.bot.sendMessage(
            query.message.chat.id,
            `Processing command failed, please try again`,
          );
      }
    } catch (error) {
      console.log(error);
    }
  };

  sendAllFeature = async (chatId: any, username: string) => {
    try {
      const allFeatures = await allFeaturesMarkup(username);
      if (allFeatures) {
        const replyMarkup = {
          inline_keyboard: allFeatures.keyboard,
        };
        await this.bot.sendMessage(chatId, allFeatures.message, {
          reply_markup: replyMarkup,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  fileUploadByUrlPrompt = async (chatId: any) => {
    try {
      const uploadUrlPrompt = await this.bot.sendMessage(
        chatId,
        'Input the PDF url 🔗: make sure it is viewable',
        { reply_markup: { force_reply: true } },
      );
      if (uploadUrlPrompt) {
        this.pdfUrlUploadPrompt[chatId] = [uploadUrlPrompt.message_id];
        return;
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
}
