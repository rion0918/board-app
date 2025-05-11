import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
      comments {
        id
        content
        createdAt
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
    }
  }
`;