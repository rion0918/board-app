import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/entities/comment.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { ReactionService } from '../reaction/reaction.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly reactionService: ReactionService,
  ) {}

  //全件取得
  @Query(() => [Post])
  allPosts(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Post[]> {
    return this.postService.findAll({ limit, offset });
  }

  //ID指定取得
  @Query(() => Post)
  post(@Args('id', { type: () => Int }) id: number): Promise<Post | null> {
    return this.postService.findOne(id);
  }

  //新規投稿
  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  //コメント機能
  @ResolveField(() => [Comment])
  comments(@Parent() post: Post): Promise<Comment[]> {
    return this.commentService.findByPost(post.id);
  }

  //リアクション機能
  @ResolveField(() => [Reaction])
  reactions(@Parent() post: Post) {
    return this.reactionService.findByPost(post.id);
  }
}
