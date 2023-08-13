import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookiesService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request
  ) {}

  set(name: string, value: string | number) {
    const cookieSettings = this.configService.get('cookies');
    this.request.res.cookie(name, value, cookieSettings);
  }

  get(name: string) {
    if (!this.request) return;

    const cookies = this.request.req?.cookies || this.request.cookies;
    return name ? cookies?.[name] : cookies;
  }

  getHeader(name: string): string {
    if (!this.request) return;

    const request = this.request.req || this.request;
    return request.header(name);
  }

  getActiveProjectId(): string {
    const activeProjectKey = this.configService.get('cookies').activeProjectKey;
    const projectId = this.getHeader(activeProjectKey);

    return projectId;
  }
}
