"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import NextLink from "next/link";
import { format } from "date-fns";
import { FaTwitter } from "react-icons/fa";
import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  Button,
  VStack,
  Image,
  Flex,
  Center,
  Skeleton,
  SkeletonText,
  useToast,
  Collapse,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  AddIcon,
  MoonIcon,
  SunIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import { GET_ALL_POSTS, CREATE_REACTION } from "@/lib/queries";

// フロントで扱うリアクションタイプを定義
const REACTION_TYPE = "laugh"; // サーバー側でこの type を受け付けること

export default function Home() {
  // --- ここに更新履歴を定義 ---
  const updates = [
    { date: "2025/05/13", text: "いいね機能にトーストを追加" },
    { date: "2025/05/13", text: "UI・UXの改善" },
    { date: "2025/05/13", text: "ダークモード切替ボタンを設置" },
  ];

  const [reactedPosts, setReactedPosts] = useState<number[]>([]);
  const [showMore, setShowMore] = useState<Record<number, boolean>>({});
  const [showUpdates, setShowUpdates] = useState(false);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: "network-only",
  });

  const [createReaction] = useMutation(CREATE_REACTION, {
    optimisticResponse: ({ input: { postId } }) => ({
      __typename: "Mutation",
      createReaction: {
        __typename: "Reaction",
        id: Math.floor(Math.random() * -1000),
        postId,
        type: REACTION_TYPE,
      },
    }),
    update(cache, { data: { createReaction } }) {
      const existing = cache.readQuery({ query: GET_ALL_POSTS }) as any;
      if (!existing) return;
      const newPosts = existing.allPosts.map((post: any) =>
        post.id === createReaction.postId
          ? { ...post, reactions: [...post.reactions, createReaction] }
          : post
      );
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: { allPosts: newPosts },
      });
    },
  });

  const handleReaction = async (postId: number) => {
    if (reactedPosts.includes(postId)) return;
    try {
      await createReaction({
        variables: { input: { postId, type: REACTION_TYPE } },
      });
      setReactedPosts((prev) => [...prev, postId]);
      toast({
        title: "🌱 草生える！",
        description: "リアクションが反映されました。",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "⚠️ エラー",
        description: "リアクションの送信に失敗しました。",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error(e);
    }
  };

  // ローディング中の Skeleton
  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} p={5} borderWidth="1px" borderRadius="lg" mb={6}>
            <Skeleton height="24px" mb="4" />
            <SkeletonText noOfLines={3} spacing="4" />
          </Box>
        ))}
      </Container>
    );
  }

  // エラー表示
  if (error) {
    return (
      <Center h="100vh">
        <Box textAlign="center" p={5} borderRadius="md" bg="red.50" color="red.600">
          <Heading size="md" mb={2}>
            エラーが発生しました
          </Heading>
          <Text>{error.message}</Text>
        </Box>
      </Center>
    );
  }

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      {/* カラーモード切替ボタン */}
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
      <Box
        bg="green.500"
        py={2}
        px={4}
        color="white"
        textAlign="center"
        fontWeight="bold"
        fontSize="sm"
      >
        神戸電子2Days掲示板 Ver.0.1.3
      </Box>

      {/* アップデート情報トグル */}
      <Box maxW="container.md" mx="auto" mt={2} px={4}>
        <IconButton
          aria-label="アップデート情報を展開"
          icon={<InfoOutlineIcon />}
          size="sm"
          variant="ghost"
          onClick={() => setShowUpdates((prev) => !prev)}
        />
        <Collapse in={showUpdates} animateOpacity>
          <Box
            p={4}
            bg={useColorModeValue("gray.50", "gray.700")}
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            borderRadius="md"
            mt={2}
          >
            {updates.map((u, i) => (
              <Text key={i} fontSize="sm" color="gray.600">
                ■ {u.date} — {u.text}
              </Text>
            ))}
          </Box>
        </Collapse>
      </Box>

      <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
        <Container maxW="container.md">
          <VStack spacing={8} align="center">
            {/* ロゴ */}
            <Box textAlign="center">
              <Image
                src="/image/KIB.png"
                alt="神戸電子掲示板 ロゴ"
                boxSize={{ base: "150px", md: "200px" }}
                objectFit="cover"
                mx="auto"
                borderRadius="full"
                border="3px solid"
                borderColor="green.400"
                shadow="lg"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>

            {/* ヘッダー */}
            <Box textAlign="center" w="full">
              <Heading
                size="xl"
                mb={6}
                color="green.600"
                fontWeight="bold"
                letterSpacing="wide"
              >
                投稿一覧
              </Heading>
              <NextLink href="/new" passHref>
                <Button
                  colorScheme="green"
                  mb={8}
                  size="lg"
                  shadow="md"
                  leftIcon={<AddIcon />}
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  新規投稿
                </Button>
              </NextLink>
            </Box>

            {/* 説明文 */}
            <Box textAlign="center" px={4}>
              <Text fontSize="md" color="gray.600" maxW="600px" mx="auto">
                〜神戸電子2Days掲示板〜へようこそ。<br />
                ここは神戸電子生が匿名でつぶやきをする場所です。<br />
                つぶやき（投稿）は2日で自動削除されます。<br />
                存分につぶやきましょう〜
              </Text>
            </Box>

            {/* 投稿リスト */}
            <VStack spacing={5} align="stretch" w="full">
              {data.allPosts.map((post: any) => {
                const hasReacted = reactedPosts.includes(post.id);
                const reactCount = post.reactions.filter(
                  (r: { type: string }) => r.type === REACTION_TYPE
                ).length;

                return (
                  <Box
                    key={post.id}
                    p={5}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={borderColor}
                    bg={cardBgColor}
                    shadow="md"
                    _hover={{
                      shadow: "lg",
                      transform: "translateY(-2px)",
                      borderColor: "green.200",
                    }}
                    transition="all 0.2s"
                  >
                    <NextLink href={`/post/${post.id}`} passHref>
                      <Link
                        _hover={{ textDecoration: "none" }}
                        _focus={{ boxShadow: "outline" }}
                        display="block"
                        style={{ textDecoration: "none" }}
                      >
                        <Text fontSize="xl" fontWeight="bold" color="green.500">
                          {post.title}
                        </Text>
                      </Link>
                    </NextLink>

                    {/* 折りたたみ可能な本文 */}
                    <Collapse in={showMore[post.id]} animateOpacity>
                      <Text mt={3} color="gray.600">
                        {post.content}
                      </Text>
                    </Collapse>
                    {!showMore[post.id] && (
                      <Text noOfLines={3} mt={3} color="gray.600">
                        {post.content}
                      </Text>
                    )}
                    {post.content.length > 100 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() =>
                          setShowMore((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        aria-label={showMore[post.id] ? "閉じる" : "続きを読む"}
                      >
                        {showMore[post.id] ? "閉じる" : "続きを読む"}
                      </Button>
                    )}

                    <Flex justify="space-between" mt={3} align="center">
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        投稿日: {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        コメント数: {post.comments.length}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        草生える数: {reactCount}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleReaction(post.id)}
                        isDisabled={hasReacted}
                        aria-label={hasReacted ? "草生える済み" : "草生える"}
                      >
                        {hasReacted ? "🌱 草生える済み" : "🌱 草生える"}
                      </Button>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* フッター */}
      <Box as="footer" bg="green.500" py={4} mt={12}>
        <Container maxW="container.md">
          <Flex justify="center" align="center" gap={2}>
            <Text fontSize="sm" color="white">
              © 2025 神戸電子2Days掲示板｜開発者→
            </Text>
            <Link
              href="https://x.com/rioi7_0918"
              isExternal
              color="white"
              _hover={{ color: "gray.300" }}
              aria-label="開発者のTwitterへ"
            >
              <FaTwitter size="1.2em" />
            </Link>
          </Flex>
        </Container>
      </Box>
    </>
  );
}