import { Module } from '@nestjs/common';
import { ConfigModule } from '../env_config/config.module';
import { CacheService } from './service';

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [CacheService],
    exports: [CacheService]
  })
export class CacheModule {
}
