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
  private pdfUploadPrompt = {};
  private startedChatting = {};

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
      this.bot.sendMessage(msg.chat.id, '⏳ Request Processing .....');
      if (msg.document) {
        if (
          msg.document['mime_type'] == 'application/pdf' &&
          this.pdfUploadPrompt
        ) {
          await this.handlefileUpload(msg.chat.id, msg.document.file_id);

          return;
        }
      } else {
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
          } else if (this.startedChatting[msg.chat.id].chat) {
            // start chatting with pdf
            try {
              const content = await this.ragService.chatWithPdf(
                this.startedChatting[msg.chat.id].sourceId,
                command,
              );
              if (content) {
                return await this.bot.sendMessage(msg.chat.id, content.reply);
              }
            } catch (error) {
              console.log(error);
            }
          }
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
          if (this.startedChatting[chatId].chat) {
            delete this.startedChatting[chatId];
            return;
          }
          return;

        case '/fileUpload':
          await this.fileUploadPrompt(chatId);
          if (this.startedChatting[chatId].chat) {
            delete this.startedChatting[chatId];
            return;
          }
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

        case '/chatPdf':
          try {
            const prompt = this.bot.sendMessage(chatId, 'Start chatting');
            if (prompt) {
              // trigger start chat
              return (this.startedChatting[chatId] = {
                sourceId: sourceId,
                chat: true,
              });
            }
          } catch (error) {
            console.log(error);
          }

        case '/viewFiles':
          try {
            const allFiles = await this.databaseService.pdf.findMany({
              where: { owner: chatId },
            });
            if (allFiles) {
              const allFilesArray = [...allFiles];
              if (allFilesArray.length == 0) {
                return this.bot.sendMessage(
                  chatId,
                  '❓ Your PDF list is empty',
                );
              } else {
                allFilesArray.map(async (file) => {
                  try {
                    const pdfDetail = await pdFDetails(
                      file.name,
                      file.url,
                      file.sourceId,
                    );
                    if (pdfDetail) {
                      const Markup = {
                        inline_keyboard: pdfDetail.keyboard,
                      };

                      await this.bot.sendMessage(chatId, file.name, {
                        reply_markup: Markup,
                      });
                    } else {
                      return;
                    }
                  } catch (error) {
                    console.log(error);
                  }
                });
              }
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

  fileUploadPrompt = async (chatId: any) => {
    try {
      const uploadPrompt = await this.bot.sendMessage(
        chatId,
        'Upload a PDF file 🔗: make sure it is less than 5mb',
        { reply_markup: { force_reply: true } },
      );
      if (uploadPrompt) {
        this.pdfUploadPrompt[chatId] = [uploadPrompt.message_id];
        return;
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  handlefileUpload = async (chatId: any, fileId: any) => {
    try {
      // Call the getFile method to get information about the file
      this.bot
        .getFile(fileId)
        .then(async (fileInfo) => {
          // Retrieve the URL of the file
          const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileInfo.file_path}`;

          const uploadUrl = await this.ragService.uploadPDFUrl(fileUrl, chatId);
          console.log(`this is the url :`, uploadUrl);
          if (uploadUrl) {
            console.log('API CALL :', uploadUrl);
            if (uploadUrl['message']) {
              await this.bot.sendMessage(
                chatId,
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
                await this.bot.sendMessage(chatId, detail.title, {
                  reply_markup: Markup,
                });
                delete this.pdfUploadPrompt[chatId];
                return;
              }
              return;
            }
            return;
          }
          console.log(`PDFurl :`, fileUrl);
          return fileUrl;
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      return;
    } catch (error) {
      console.log(error);
    }
  };
}
