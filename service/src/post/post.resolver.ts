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

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService, // ← 追加
  ) {}

  @Query(() => [Post])
  allPosts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query(() => Post)
  post(@Args('id', { type: () => Int }) id: number): Promise<Post | null> {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  @ResolveField(() => [Comment])
  comments(@Parent() post: Post): Promise<Comment[]> {
    return this.commentService.findByPost(post.id);
  }
}
