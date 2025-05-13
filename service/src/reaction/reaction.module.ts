// src/reaction/reaction.module.ts
import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionResolver } from './reaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReactionResolver, ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}
