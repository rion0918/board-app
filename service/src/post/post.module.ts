// post.module.ts
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from 'src/comment/comment.module';
import { ReactionModule } from '../reaction/reaction.module';

import { PostCron } from './post.cron';

@Module({
  imports: [PrismaModule, CommentModule, ReactionModule],
  providers: [PostService, PostResolver, PostCron],
})
export class PostModule {}
