'use client';

import { useMutation } from '@apollo/client';
import { CREATE_POST } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Link,
} from '@chakra-ui/react';

export default function NewPostPage() {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createPost] = useMutation(CREATE_POST);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createPost({
        variables: { input: { title, content } },
      });
      const newPostId = res.data?.createPost?.id;
      if (newPostId) {
        router.push('/');
      }
    } catch (err) {
      toast({
        title: '投稿に失敗しました',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* バージョン表示 */}
      <Box bg="green.500" py={2} px={4} color="white" textAlign="center" fontWeight="bold" fontSize="sm">
        神戸電子2Days掲示板 Ver.0.1.3
      </Box>
      
      <Box mb={4}>
        <NextLink href="/" passHref>
          <Link
            color="blue.500"
            fontWeight="bold"
            _hover={{ textDecoration: 'underline' }}
          >
            ← メインページに戻る
          </Link>
        </NextLink>
      </Box>

      <Box maxW="xl" mx="auto" py={10} px={6}>
        <Heading mb={6}>新規投稿</Heading>
        <form onSubmit={handleSubmit}>
          <VStack gap={4}>
            <Input
              placeholder="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isRequired
            />
            <Textarea
              placeholder="本文"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              isRequired
            />
            <Button isLoading={loading} colorScheme="teal" type="submit">
              投稿する
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
}