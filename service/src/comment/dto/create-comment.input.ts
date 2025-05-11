import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  content: string;

  @Field(() => Int)
  postId: number;
}

//GraphQLの mutation createComment(input: CreateCommentInput) の形で使う
