import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

// post/post.service.ts
@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  //全件取得
  async findAll() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  //ID指定取得
  async findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  //新規投稿
  async create(input: CreatePostInput): Promise<Post> {
    return this.prisma.post.create({ data: input });
  }
}
