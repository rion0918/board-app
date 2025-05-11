//dtoを作ることにより、出力と入力の型を分けることができる
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;
}

//ここでは入力の型を定義している
