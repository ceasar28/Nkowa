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
  uploadPDFUrl = async (url: string) => {
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
        const title = await this.generatePDFTitle('src_RkRpwMJ7BiKkn4zxCJpRf');
        if (title) {
          try {
            this.savePdftoDB();
            return Upload.data;
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

  savePdftoDB = async (savePDFDto: Prisma.PdfCreateInput) => {
    try {
      const saved = await this.databaseService.pdf.create({ data: savePDFDto });
      if (saved) {
        return;
      }
      return;
    } catch (error) {
      console.log;
    }
  };
}
