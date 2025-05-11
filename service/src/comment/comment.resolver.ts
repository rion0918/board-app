// src/comment/comment.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  //コメント作成
  @Mutation(() => Comment)
  createComment(@Args('input') input: CreateCommentInput) {
    return this.commentService.create(input);
  }

  //ID別のコメント取得
  @Query(() => [Comment])
  findByPost(@Args('postId', { type: () => Int }) postId: number) {
    return this.commentService.findByPost(postId);
  }
}
