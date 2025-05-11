import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => Post)
  post: Post;

  @Field(() => Int)
  postId: number;

  @Field(() => Date)
  createdAt: Date;
}

//以上はただのオブジェクト、レスポンスの型を定義しているだけ
