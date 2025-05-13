"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Link,
  IconButton,
  useColorMode,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/lib/queries";

export default function NewPostPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createPost, { loading }] = useMutation(CREATE_POST);

  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createPost({
        variables: { input: { title: title.trim(), content: content.trim() } },
      });
      const newPostId = res.data?.createPost?.id;
      toast({
        title: newPostId ? "投稿に成功しました！" : "投稿が完了しました",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      // 少し待ってからトップへ遷移
      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      console.error(err);
      toast({
        title: "投稿に失敗しました",
        description: "ネットワークを確認するか、再度お試しください。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isSubmitDisabled = !title.trim() || !content.trim() || loading;

  return (
    <>
      {/* カラーモード切替 */}
      <IconButton
        aria-label="カラーモード切替"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        position="fixed"
        top="1rem"
        right="1rem"
        zIndex={10}
      />

      {/* バージョン表示 */}
      <Box bg="green.500" py={2} px={4} color="white" textAlign="center" fontWeight="bold" fontSize="sm">
        神戸電子2Days掲示板 Ver.0.1.3
      </Box>

      <Box maxW="xl" mx="auto" py={10} px={6} bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
        {/* 戻るリンク */}
        <Box mb={6}>
          <NextLink href="/" passHref>
            <Link
              color="blue.500"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
              aria-label="メインページに戻る"
            >
              ← メインページに戻る
            </Link>
          </NextLink>
        </Box>

        <Box bg={bg} borderWidth="1px" borderColor={border} borderRadius="md" p={6} shadow="sm">
          <Heading mb={4} size="lg">
            新規投稿
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <FormControl isRequired>
                <FormLabel>タイトル</FormLabel>
                <Input
                  placeholder="投稿のタイトルを入力"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={30}
                  aria-describedby="title-helper"
                />
                <FormHelperText id="title-helper">
                  {title.length}/30 文字
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>本文</FormLabel>
                <Textarea
                  placeholder="投稿したい内容を書く"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  minH="120px"
                  maxLength={500}
                  aria-describedby="content-helper"
                />
                <FormHelperText id="content-helper">
                  {content.length}/500 文字
                </FormHelperText>
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                isLoading={loading}
                isDisabled={isSubmitDisabled}
                aria-label="投稿を送信"
              >
                投稿する
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
  );
}