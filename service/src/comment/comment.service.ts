// src/comment/comment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  //コメントを作成するメソッド
  create(createCommentInput: CreateCommentInput) {
    return this.prisma.comment.create({
      data: createCommentInput,
    });
  }
  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { post: true }, // ← これを追加
    });
  }
}
