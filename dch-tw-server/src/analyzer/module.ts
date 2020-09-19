import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '../cache/module';
import { AnalyzerService } from './service';

@Module({
    imports: [CqrsModule, CacheModule],
    controllers: [],
    providers: [AnalyzerService],
  })
export class AnalyzerModule {

}