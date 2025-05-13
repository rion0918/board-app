import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReactionInput } from './dto/create-reaction.input';
import { Reaction } from './entities/reaction.entity';

@Injectable()
export class ReactionService {
  constructor(private readonly prisma: PrismaService) {}

  // reaction.service.ts
  async findByPost(postId: number): Promise<Reaction[]> {
    return this.prisma.reaction.findMany({
      where: { postId },
    });
  }

  async create(input: CreateReactionInput): Promise<Reaction> {
    return this.prisma.reaction.create({
      data: input,
    });
  }
}
