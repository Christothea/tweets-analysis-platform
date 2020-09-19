import { Controller, Post, Request, Body, Res, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryRequest } from '@dch/data-models';

@Controller('tw-manager')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('collect')
  async collectTweets(@Request() req, @Body() query: QueryRequest, @Res() response) {
    if (!query) {
      response.status = 400;
      response.send();
    }

    try {
      this.appService.collectTweets(query);
      response.status = 200;
      response.send();
    } catch (ex) {
      console.error('Collect Tweets Exception');
      console.log(ex);
      response.status = 500;
      response.send();
    }
  }

  @Get('statistics')
  async statisticsRequest(@Request() req, @Res() response) {
    try {
      this.appService.statisticsRequest();
      response.status = 200;
      response.send(await this.appService.statisticsRequest());
    } catch (ex) {
      console.error('Analyze Tweets Exception');
      console.log(ex);
      response.status = 500;
      response.send();
    }
  }
}
