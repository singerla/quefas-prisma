import { Global, Module } from '@nestjs/common';
import { CookiesService } from './cookies.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [CookiesService, ConfigService],
  exports: [CookiesService],
})
export class CookiesModule {}
