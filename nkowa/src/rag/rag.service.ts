import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RagService {
  // injecting Httpservice
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}

  // upload pdfByUrl
  uploadPDFUrl = async (url: string, chatId: any) => {
    // console.log(`THIS IS THE URL :`, url);
    try {
      const Upload = await this.httpService.axiosRef.post(
        `https://api.chatpdf.com/v1/sources/add-url`,
        {
          url: url,
        },
        {
          headers: {
            'content-Type': 'application/json',
            'x-api-key': process.env.chatpdfApiKey,
          },
        },
      );
      if (Upload) {
        const title = await this.generatePDFTitle(Upload.data['sourceId']);
        if (title) {
          try {
            const saved = await this.savePdftoDB({
              name: title,
              url: url,
              sourceId: Upload.data['sourceId'],
              owner: chatId,
            });
            if (saved) {
              console.log('saved pdf :', saved);
              return saved;
            }
            return;
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  };

  generatePDFTitle = async (sourceId: string) => {
    try {
      console.log('TITLE CALLED HERE', sourceId);
      const pdfTitle = await this.httpService.axiosRef.post(
        `https://api.chatpdf.com/v1/chats/message`,
        {
          sourceId: sourceId,
          messages: [
            {
              role: 'user',
              content: 'Generate a name for the pdf',
            },
          ],
        },
        {
          headers: {
            'content-Type': 'application/json',
            'x-api-key': process.env.chatpdfApiKey,
          },
        },
      );

      if (pdfTitle) {
        return pdfTitle.data['content'];
      } else {
        console.log('Title not found');
      }
    } catch (error) {
      console.log('this is erro :', error);
    }
  };

  getSummary = async (sourceId: string) => {
    try {
      const summary = await this.httpService.axiosRef.post(
        `https://api.chatpdf.com/v1/chats/message`,
        {
          sourceId: sourceId,
          messages: [
            {
              role: 'user',
              content: 'Summarize the pdf',
            },
          ],
        },
        {
          headers: {
            'content-Type': 'application/json',
            'x-api-key': process.env.chatpdfApiKey,
          },
        },
      );

      if (summary) {
        return {
          sourceId: sourceId,
          summary: summary.data['content'],
        };
      } else {
        console.log('No summary');
      }
    } catch (error) {
      console.log('this is erro :', error);
    }
  };

  chatWithPdf = async (sourceId: string, content: string) => {
    const payLoad = {
      sourceId: sourceId,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    };
    try {
      const response = await this.httpService.axiosRef.post(
        `https://api.chatpdf.com/v1/chats/message`,
        payLoad,
        {
          headers: {
            'content-Type': 'application/json',
            'x-api-key': process.env.chatpdfApiKey,
          },
        },
      );

      if (response) {
        return {
          sourceId: sourceId,
          reply: response.data['content'],
        };
      } else {
        console.log('No response');
      }
    } catch (error) {
      console.log('this is erro :', error);
    }
  };

  savePdftoDB = async (savePDFDto: Prisma.PdfCreateInput) => {
    try {
      const saved = await this.databaseService.pdf.create({ data: savePDFDto });
      if (saved) {
        return saved;
      }
      return;
    } catch (error) {
      console.log;
    }
  };

  linkToAkwukwo = async (nkowaId: any, url: string) => {
    const user = await this.databaseService.user.findFirst({
      where: { nkowa_id: nkowaId },
    });
    if (!user) {
      return { message: 'user not found' };
    }
    const saved = await this.uploadPDFUrl(url, user.chat_id);
    if (saved) {
      return { message: ' LInked successful head to https://t.me/nkowa_Bot/' };
    }
  };
}
