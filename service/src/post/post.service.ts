import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

// post/post.service.ts
@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async create(input: CreatePostInput): Promise<Post> {
    return this.prisma.post.create({ data: input });
  }
}
