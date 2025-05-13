import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Reaction {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  type: string;

  @Field(() => Int)
  postId: number;

  @Field(() => Date)
  createdAt: Date;
}

//以上はただのオブジェクト、レスポンスの型を定義しているだけ
