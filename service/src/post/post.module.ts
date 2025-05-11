// post.module.ts
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [PrismaModule, CommentModule],
  providers: [PostService, PostResolver],
})
export class PostModule {}
