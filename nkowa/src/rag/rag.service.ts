import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RagService {
  // injecting Httpservice
  constructor(private readonly httpService: HttpService) {}

  // upload pdfByUrl
  uploadPDFUrl = async (url: string) => {
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
        console.log(Upload);
        return Upload.data;
      }
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  };
}
