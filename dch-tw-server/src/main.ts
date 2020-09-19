import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app;
async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(8009);
}

function exit() {
  process.on('SIGINT', async () => {
    console.log('Gracefull Exit the Application');
    try {
      if (app) {
        await app.close();
      }
    } catch (ex) {
      console.warn('Error on Application Gracefull Exit');
      console.warn(ex);
    }
    // Exit the application
    process.exit(0);
  });
}

exit();
bootstrap();
