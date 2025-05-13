import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ReactionService } from './reaction.service';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionInput } from './dto/create-reaction.input';

@Resolver(() => Reaction)
export class ReactionResolver {
  constructor(private readonly reactionService: ReactionService) {}

  // リアクション作成
  @Mutation(() => Reaction)
  createReaction(@Args('input') input: CreateReactionInput) {
    return this.reactionService.create(input);
  }
}
