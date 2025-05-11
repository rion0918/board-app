import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}

//以上はただのオブジェクト、レスポンスの型を定義しているだけ
