// post.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PostService } from './post.service';

@Injectable()
export class PostCron {
  constructor(private readonly postService: PostService) {}

  // 毎日深夜3時に実行
  @Cron('10 12 * * *') // 毎日12時10分に実行
  handleCron() {
    this.postService.removePost();
  }
}
