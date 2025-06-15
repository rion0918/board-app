'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@apollo/client'
import { GET_POSTS, CREATE_COMMENT } from '@/lib/queries'
import { useState } from 'react'
import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  VStack,
  Textarea,
  Button,
  Divider,
  Link,
  Skeleton,
  SkeletonText,
  useToast,
  IconButton,
  useColorMode,
  useColorModeValue,
  Center,
  Collapse,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Badge,             
  Flex,              
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

// 公式コメント用ハードコーディングパスワード
const ADMIN_PASSWORD = '0715'

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const toast = useToast()
  const { colorMode, toggleColorMode } = useColorMode()

  if (!id || isNaN(Number(id))) {
    return (
      <Center h="100vh">
        <Text color="red.500">不正なIDです</Text>
      </Center>
    )
  }
  const postId = Number(id)

  // 投稿＋コメント取得
  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    variables: { id: postId },
    fetchPolicy: 'network-only',
  })

  // フロント側で管理する公式投稿フラグ
  const isPostOfficial = typeof window !== 'undefined'
    ? localStorage.getItem(`official_post_${postId}`) === 'true'
    : false

  // コメント用ステート
  const [content, setContent] = useState('')
  const [isCommentOfficial, setIsCommentOfficial] = useState(false)
  const [commentPassword, setCommentPassword] = useState('')

  const [createComment, { loading: posting }] = useMutation(CREATE_COMMENT, {
    onCompleted: (res) => {
      const newCommentId = res.createComment.id
      // 公式コメントなら localStorage に
      if (isCommentOfficial) {
        localStorage.setItem(`official_comment_${newCommentId}`, 'true')
      }
      setContent('')
      setCommentPassword('')
      setIsCommentOfficial(false)
      refetch()
      toast({
        title: 'コメントを投稿しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    },
    onError: () => {
      toast({
        title: 'コメントの送信に失敗しました',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isCommentOfficial && commentPassword !== ADMIN_PASSWORD) {
      toast({
        title: '公式パスワードが違います',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }
    createComment({ variables: { input: { content, postId } } })
  }

  // ソート済みコメント
  const sortedComments = data?.post?.comments
    ? [...data.post.comments].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : []

  const bg = useColorModeValue('white', 'gray.700')
  const border = useColorModeValue('gray.200', 'gray.600')

  return (
    <>
      {/* カラーモード切替 */}
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        position="fixed"
        top="1rem"
        right="1rem"
        zIndex={10}
      />

      {/* バージョン */}
      <Box
        bg="green.500"
        color="white"
        textAlign="center"
        py={2}
        fontSize="sm"
        fontWeight="bold"
      >
        神戸電子2Days掲示板 Ver.0.1.4
      </Box>

      <Box maxW="2xl" mx="auto" p={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
        <Box mb={4}>
          <NextLink href="/" passHref>
            <Link color="blue.500" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
              ← メインページに戻る
            </Link>
          </NextLink>
        </Box>

        {loading ? (
          <Box>
            <Skeleton height="32px" mb="4" />
            <SkeletonText noOfLines={4} spacing="4" mb="6" />
            {[...Array(2)].map((_, i) => (
              <Box key={i} p={4} borderWidth="1px" borderRadius="md" mb="4">
                <SkeletonText noOfLines={2} spacing="3" />
              </Box>
            ))}
          </Box>
        ) : error ? (
          <Center py={10}>
            <Box bg="red.50" p={4} borderRadius="md" border="1px solid" borderColor="red.200">
              <Text color="red.600" fontWeight="bold" mb={2}>
                エラー
              </Text>
              <Text color="red.600">{error.message}</Text>
            </Box>
          </Center>
        ) : (
          <>
            {/* 投稿詳細 */}
            <Box p={6} bg={bg} borderWidth="1px" borderColor={border} borderRadius="md" mb={8}>
              <Flex align="center" mb={4}>
                <Heading size="lg" mr={2}>
                  {data.post.title}
                </Heading>
                {isPostOfficial && (
                  <Badge colorScheme="blue" variant="subtle">
                    公式
                  </Badge>
                )}
              </Flex>
              <Collapse in={true} startingHeight={100}>
                <Text whiteSpace="pre-wrap" color={useColorModeValue('gray.800', 'gray.200')}>
                  {data.post.content}
                </Text>
              </Collapse>
            </Box>

            {/* コメントフォーム */}
            <Box as="form" onSubmit={handleSubmit} mb={6}>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.currentTarget.value)}
                placeholder="コメントを入力..."
                minH="100px"
                mb={3}
                isRequired
                bg={bg}
                borderColor={border}
                _placeholder={{ color: 'gray.400' }}
              />

              {/* 公式コメント切替 */}
              <FormControl display="flex" alignItems="center" mb={3}>
                <FormLabel htmlFor="official-switch" mb="0">
                  公式コメントにする
                </FormLabel>
                <Switch
                  id="official-switch"
                  isChecked={isCommentOfficial}
                  onChange={(e) => setIsCommentOfficial(e.target.checked)}
                />
              </FormControl>

              {isCommentOfficial && (
                <FormControl isRequired mb={3}>
                  <FormLabel>公式パスワード</FormLabel>
                  <Input
                    type="password"
                    placeholder="パスワードを入力"
                    value={commentPassword}
                    onChange={(e) => setCommentPassword(e.target.value)}
                  />
                </FormControl>
              )}

              <Button type="submit" colorScheme="green" isLoading={posting}>
                コメントする
              </Button>
            </Box>

            <Divider mb={6} />

            {/* コメント一覧 */}
            <VStack spacing={4} align="stretch">
              {sortedComments.length === 0 && (
                <Text color="gray.500" textAlign="center">
                  コメントはまだありません
                </Text>
              )}
              {sortedComments.map((comment: any) => {
                const isCmtOfficial = localStorage.getItem(`official_comment_${comment.id}`) === 'true'
                return (
                  <Box
                    key={comment.id}
                    p={4}
                    bg={bg}
                    borderWidth="1px"
                    borderColor={border}
                    borderRadius="md"
                  >
                    <Flex align="center">
                      <Text whiteSpace="pre-wrap">{comment.content}</Text>
                      {isCmtOfficial && (
                        <Badge ml={2} colorScheme="blue" variant="subtle">
                          公式
                        </Badge>
                      )}
                    </Flex>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </Text>
                  </Box>
                )
              })}
            </VStack>
          </>
        )}
      </Box>
    </>
  )
}