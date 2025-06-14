import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

// post/post.service.ts
@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // ページネーション対応
  async findAll({
    limit,
    offset,
  }: {
    limit?: number;
    offset?: number;
  } = {}): Promise<Post[]> {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  //ID指定取得
  async findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  //新規投稿
  async create(input: CreatePostInput): Promise<Post> {
    return this.prisma.post.create({ data: input });
  }

  //自動削除
  async removePost() {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    // コメント → リアクション → 投稿 の順で削除
    await this.prisma.comment.deleteMany({
      where: {
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });

    await this.prisma.reaction.deleteMany({
      where: {
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });

    await this.prisma.post.deleteMany({
      where: {
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });
    return { message: '2日以上前の投稿とコメントを削除しました' };
  }
}
