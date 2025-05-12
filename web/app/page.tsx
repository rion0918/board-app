"use client"

import { gql, useQuery } from "@apollo/client"
import NextLink from "next/link"
import { format } from "date-fns"
import { FaXTwitter } from "react-icons/fa6"
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

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    allPosts {
      id
      title
      content
      createdAt
      comments {
        id
      }
    }
  }
`

export default function Home() {
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: "network-only",
  })

  const bgColor = useColorModeValue("white", "gray.800")
  const cardBgColor = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
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

  return (
    <>
      <Box bg="blue.500" py={2} px={4} color="white" textAlign="center" fontWeight="bold" fontSize="sm">
        神戸電子2Days掲示板 Ver.0.0.2
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
                borderColor="blue.400"
                shadow="lg"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>

            {/* ヘッダー */}
            <Box textAlign="center" w="full">
              <Heading size="xl" mb={6} color="blue.600" fontWeight="bold" letterSpacing="wide">
                投稿一覧
              </Heading>

              <NextLink href="/new" passHref>
                <Button
                  colorScheme="blue"
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
              {data.allPosts.map((post: any) => (
                <NextLink href={`/post/${post.id}`} passHref key={post.id}>
                  <Link
                    _hover={{ textDecoration: "none" }}
                    _focus={{ boxShadow: "outline" }}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      p={5}
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      bg={cardBgColor}
                      shadow="md"
                      _hover={{
                        shadow: "lg",
                        transform: "translateY(-2px)",
                        borderColor: "blue.200",
                      }}
                      transition="all 0.2s"
                    >
                      <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        {post.title}
                      </Text>

                      <Box maxH="100px" overflowY="auto">
                        <Text mt={3} color="gray.600">
                          {post.content}
                        </Text>
                      </Box>

                      <Flex justify="space-between" mt={3} align="center">
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                          投稿日: {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          コメント数: {post.comments.length}
                        </Text>
                      </Flex>
                    </Box>
                  </Link>
                </NextLink>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* フッター */}
      <Box as="footer" bg="blue.500" py={4} mt={12}>
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
              <FaXTwitter size="1.2em" />
            </Link>
          </Flex>
        </Container>
      </Box>
    </>
  )
}