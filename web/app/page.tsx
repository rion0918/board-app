"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import NextLink from "next/link"
import { format } from "date-fns"
import { FaTwitter } from "react-icons/fa"
import { GET_ALL_POSTS, CREATE_REACTION } from "@/lib/queries"
import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  Button,
  VStack,
  Spinner,
  Image,
  Flex,
  Center,
  useColorModeValue,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

// フロントで扱うリアクションタイプを定義
const REACTION_TYPE = "laugh"  // サーバー側でこの type を受け付けること

export default function Home() {
  // 一度リアクションした投稿IDを管理
  const [reactedPosts, setReactedPosts] = useState<number[]>([])

  // 投稿一覧を常に最新で取得
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: "network-only",
  })

  // オプティミスティックUI + キャッシュ更新
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
      const existing = cache.readQuery({ query: GET_ALL_POSTS }) as any
      if (!existing) return
      const newPosts = existing.allPosts.map((post: any) =>
        post.id === createReaction.postId
          ? { ...post, reactions: [...post.reactions, createReaction] }
          : post
      )
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: { allPosts: newPosts },
      })
    },
  })

  // 🌱草生えるハンドラー（1回だけ）
  const handleReaction = async (postId: number) => {
    if (reactedPosts.includes(postId)) return

    try {
      await createReaction({
        variables: { input: { postId, type: REACTION_TYPE } },
      })
      setReactedPosts(prev => [...prev, postId])
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="green.500"
          size="xl"
        />
      </Center>
    )
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
    )
  }

  const bgColor = useColorModeValue("white", "gray.800")
  const cardBgColor = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <>
      {/* バージョン表示 */}
      <Box bg="green.500" py={2} px={4} color="white" textAlign="center" fontWeight="bold" fontSize="sm">
        神戸電子2Days掲示板 Ver.0.1.3
      </Box>

      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="container.md">
          <VStack spacing={8} align="center">
            {/* ロゴ */}
            <Box textAlign="center">
              <Image
                src="/image/KIB.png"
                alt="神戸電子掲示板"
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
              <Heading size="xl" mb={6} color="green.600" fontWeight="bold" letterSpacing="wide">
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
                神戸電子2Days掲示板へようこそ。<br />
                ここは神戸電子生が匿名でつぶやきをする場所です。<br />
                つぶやき（投稿）は2日で自動削除されます。<br />
                存分につぶやきましょう〜
              </Text>
            </Box>

            {/* 投稿リスト */}
            <VStack spacing={5} align="stretch" w="full">
              {data.allPosts.map((post: any) => {
                const hasReacted = reactedPosts.includes(post.id)
                const reactCount = post.reactions.filter((r: { type: string }) => r.type === REACTION_TYPE).length

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
                        style={{ textDecoration: "none" }}
                        display="block"
                      >
                        <Text fontSize="xl" fontWeight="bold" color="green.500">
                          {post.title}
                        </Text>
                        <Box maxH="100px" overflowY="auto">
                          <Text mt={3} color="gray.600">
                            {post.content}
                          </Text>
                        </Box>
                      </Link>
                    </NextLink>

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
                      >
                        {hasReacted ? "🌱 草生える済み" : "🌱 草生える"}
                      </Button>
                    </Flex>
                  </Box>
                )
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
            >
              <FaTwitter size="1.2em" />
            </Link>
          </Flex>
        </Container>
      </Box>
    </>
  )
}