import { gql } from '@apollo/client';

export const GET_POSTS = gql`
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

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query GetAllPosts($limit: Int, $offset: Int) {
    allPosts(limit: $limit, offset: $offset) {
      id
      title
      content
      createdAt
      comments {
        id
      }
      reactions {
        id
        type
      }
    }
  }
`;

export const CREATE_REACTION = gql`
  mutation CreateReaction($input: CreateReactionInput!) {
    createReaction(input: $input) {
      id
      type
      postId
    }
  }
`;
