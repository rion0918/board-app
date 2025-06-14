// src/comment/comment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  //コメントを作成するメソッド
  async create(createCommentInput: CreateCommentInput) {
    return this.prisma.comment.create({
      data: createCommentInput,
    });
  }

  //指定したIDのコメントを取得するメソッド
  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { post: true },
    });
  }
}
