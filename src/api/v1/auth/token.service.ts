import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveTokens(userId: string, accessToken: string, refreshToken: string) {
    await this.cacheManager.set(`access_token:${userId}`, accessToken,  3600 ); // expires in 1 hour
    await this.cacheManager.set(`refresh_token:${userId}`, refreshToken, 604800 ); // expires in 1 week
  }

  async getAccessToken(userId: string): Promise<string | null> {
    return this.cacheManager.get(`access_token:${userId}`);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.cacheManager.get(`refresh_token:${userId}`);
  }

  async deleteTokens(userId: string) {
    await this.cacheManager.del(`access_token:${userId}`);
    await this.cacheManager.del(`refresh_token:${userId}`);
  }
}