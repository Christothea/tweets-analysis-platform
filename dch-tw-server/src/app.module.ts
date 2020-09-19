import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectorModule } from './collector/module';
import { ConfigModule } from './env_config/config.module';
import { AnalyzerModule } from './analyzer/module';
import { CacheModule } from './cache/module';

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    CollectorModule,
    AnalyzerModule,
    CacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
