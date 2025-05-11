'use client';

import { gql, useQuery } from '@apollo/client';
import NextLink from 'next/link';
import {
  Box,
  Heading,
  Text,
  Link,
  Button,
  VStack,
  Spinner,
} from '@chakra-ui/react';

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    allPosts {
      id
      title
      content
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">エラーが発生しました: {error.message}</Text>;

  return (
    <Box p={8}>
      <Heading mb={4}>神戸電子2DAYS掲示板</Heading>
      <Heading size="md" mb={4}>投稿一覧</Heading>

      <NextLink href="/new" passHref>
        <Button colorScheme="blue" mb={6}>新規投稿</Button>
      </NextLink>

      <VStack spacing={4} align="stretch">
        {data.allPosts.map((post: any) => (
          <Box key={post.id} p={4} borderWidth="1px" borderRadius="md">
            <NextLink href={`/post/${post.id}`} passHref>
              <Link fontSize="xl" fontWeight="bold" color="blue.500">
                {post.title}
              </Link>
            </NextLink>
            <Text mt={2}>{post.content}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}