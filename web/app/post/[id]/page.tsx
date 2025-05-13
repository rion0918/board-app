'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMMENTS, CREATE_COMMENT } from '@/lib/queries';
import { useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Heading,
  Text,
  VStack,
  Textarea,
  Button,
  Spinner,
  Divider,
  Link,
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
    <>
      {/* バージョン表示 */}
      <Box bg="green.500" py={2} px={4} color="white" textAlign="center" fontWeight="bold" fontSize="sm">
        神戸電子2Days掲示板 Ver.0.1.3
      </Box>
      
      <Box mb={4}>
        <NextLink href="/" passHref>
          <Link color="blue.500" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
            ← メインページに戻る
          </Link>
        </NextLink>
      </Box>

      <Box maxW="2xl" mx="auto" p={8}>
        <Heading size="lg" mb={2}>{post.title}</Heading>
        <Text mb={6}>{post.content}</Text>

        <Heading size="md" mt={8} mb={4}>コメント</Heading>

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

        <Divider my={6} />

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
      </Box>
    </>
  );
}