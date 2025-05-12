'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMMENTS, CREATE_COMMENT } from '@/lib/queries';
import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Textarea,
  Button,
  Spinner,
} from '@chakra-ui/react';

export default function PostDetailPage() {
  const { id } = useParams();
  if (!id || isNaN(Number(id))) return <Text>不正なIDです</Text>;

  const postId = Number(id);
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { id: postId },
  });

  const [content, setContent] = useState('');
  const [createComment, { loading: posting }] = useMutation(CREATE_COMMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createComment({
      variables: { input: { content, postId } },
    });
    setContent('');
    await refetch();
  };

  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">エラー: {error.message}</Text>;

  const post = data.post;

  return (
    <Box maxW="2xl" mx="auto" p={8}>
      <Heading size="lg" mb={2}>{post.title}</Heading>
      <Text mb={6}>{post.content}</Text>

      <Heading size="md" mt={8} mb={4}>コメント</Heading>
      <VStack align="stretch" spacing={4} mb={6}>
        {post.comments.map((comment: any) => (
          <Box key={comment.id} borderWidth="1px" borderRadius="md" p={4}>
            <Text>{comment.content}</Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              {new Date(comment.createdAt).toLocaleString()}
            </Text>
          </Box>
        ))}
      </VStack>

      <Box as="form" onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力..."
          minHeight="80px"
          mb={4}
          isRequired
        />
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={posting}
        >
          コメントする
        </Button>
      </Box>
    </Box>
  );
}