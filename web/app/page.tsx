'use client';

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
  Badge,            
} from "@chakra-ui/react";
import {
  AddIcon,
  MoonIcon,
  SunIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import { GET_ALL_POSTS, CREATE_REACTION } from "@/lib/queries";

const POSTS_PER_PAGE = 10;

// フロントで扱うリアクションタイプを定義
const REACTION_TYPE = "laugh";

export default function Home() {
  const updates = [
    { date: "2025/06/14", text: "投稿のページ分け" },
    { date: "2025/05/13", text: "公式機能" },
    { date: "2025/05/13", text: "投稿字数の変更" },
    { date: "2025/05/13", text: "並び順エラー修正" },
    { date: "2025/05/13", text: "いいね機能にトーストを追加" },
    { date: "2025/05/13", text: "UI・UXの改善" },
    { date: "2025/05/13", text: "ダークモード切替ボタンを設置" },
  ];

  // リアクション済みの投稿IDを管理する状態
  const [reactedPosts, setReactedPosts] = useState<number[]>([]);
  // 投稿の詳細を表示するための状態
  const [showMore, setShowMore] = useState<Record<number, boolean>>({});
  // アップデート情報の表示状態
  const [showUpdates, setShowUpdates] = useState(false);
  // ページネーションのための状態
  const [page, setPage] = useState(0);

  const toast = useToast();
  // カラーモードの切替
  const { colorMode, toggleColorMode } = useColorMode();

  const { data, loading, error, refetch } = useQuery(GET_ALL_POSTS, {
    variables: { limit: POSTS_PER_PAGE, offset: page * POSTS_PER_PAGE },
    fetchPolicy: "network-only",
  });

  // リアクションを作成するためのミューテーション
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
    refetchQueries: [
      {
        query: GET_ALL_POSTS,
        variables: { limit: POSTS_PER_PAGE, offset: page * POSTS_PER_PAGE },
      },
    ],
    awaitRefetchQueries: true,
  });

  // 草リアクションを送信する関数
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

  const cardBgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      <IconButton
        aria-label="カラーモード切替"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        position="fixed"
        top="1rem"
        right="1rem"
        zIndex={10}
      />

      <Box
        bg="green.500"
        py={2}
        px={4}
        color="white"
        textAlign="center"
        fontWeight="bold"
        fontSize="sm"
      >
        神戸電子2Days掲示板 Ver.0.1.4
      </Box>

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
            borderColor={borderColor}
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
            <Image
              src="/image/KIB.png"
              alt="神戸電子掲示板 ロゴ"
              boxSize={{ base: "150px", md: "200px" }}
              objectFit="cover"
              borderRadius="full"
              border="3px solid"
              borderColor="green.400"
              shadow="lg"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            />

            <Box textAlign="center" w="full">
              <Heading size="xl" mb={6} color="green.600" fontWeight="bold">
                投稿一覧
              </Heading>
              <NextLink href="/new" passHref>
                <Button
                  colorScheme="green"
                  mb={8}
                  size="lg"
                  leftIcon={<AddIcon />}
                  shadow="md"
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  新規投稿
                </Button>
              </NextLink>
            </Box>

            <Text fontSize="md" color="gray.600" maxW="600px" textAlign="center" px={4}>
              〜神戸電子2Days掲示板〜<br />
              ここは神戸電子生が匿名でつぶやきをする場所<br />
              つぶやき（投稿）は2日で自動削除されます。<br />
              存分につぶやきましょう〜
            </Text>

            <VStack spacing={5} align="stretch" w="full">
              {data.allPosts.map((post: any) => {
                const hasReacted = reactedPosts.includes(post.id);
                const reactCount = post.reactions.filter(
                  (r: { type: string }) => r.type === REACTION_TYPE
                ).length;
                const isOfficial = 
                  typeof window !== "undefined" &&
                  localStorage.getItem(`official_post_${post.id}`) === "true";

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
                      <Link _hover={{ textDecoration: "none" }}>
                        <Flex align="center">
                          <Text fontSize="xl" fontWeight="bold" color="green.500">
                            {post.title}
                          </Text>
                          {isOfficial && (
                            <Badge ml={2} colorScheme="blue" variant="subtle">
                              公式
                            </Badge>
                          )}
                        </Flex>
                      </Link>
                    </NextLink>

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
                          setShowMore((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                        }
                        aria-label={showMore[post.id] ? "閉じる" : "続きを読む"}
                      >
                        {showMore[post.id] ? "閉じる" : "続きを読む"}
                      </Button>
                    )}

                    <Flex justify="space-between" mt={3} align="center">
                      <Text fontSize="sm" color="gray.500">
                        投稿日: {format(new Date(post.createdAt), "MM/dd HH:mm")}
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
            <Flex justify="space-between" mt={4}>
              <Button
                onClick={() => {
                  const prev = Math.max(page - 1, 0);
                  setPage(prev);
                  refetch({ limit: POSTS_PER_PAGE, offset: prev * POSTS_PER_PAGE });
                }}
                isDisabled={page === 0}
              >
                前へ
              </Button>
              <Button
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  refetch({ limit: POSTS_PER_PAGE, offset: next * POSTS_PER_PAGE });
                }}
                isDisabled={data?.allPosts.length < POSTS_PER_PAGE}
              >
                次へ
              </Button>
            </Flex>
          </VStack>
        </Container>
      </Box>

      <Box as="footer" bg="green.500" py={4} mt={12}>
        <Container maxW="container.md">
          <Flex justify="center" align="center" gap={2}>
            <Text fontSize="sm" color="white">
              © 2025 神戸電子2Days掲示板｜開発者→
            </Text>
            <Link href="https://x.com/rioi7_0918" isExternal color="white">
              <FaTwitter size="1.2em" />
            </Link>
          </Flex>
        </Container>
      </Box>
    </>
  );
}