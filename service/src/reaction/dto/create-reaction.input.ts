import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReactionInput {
  @Field(() => String)
  type: string;

  @Field(() => Int)
  postId: number;
}

//GraphQLの mutation createComment(input: CreateCommentInput) の形で使う
