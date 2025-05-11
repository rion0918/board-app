'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMMENTS, CREATE_COMMENT } from '@/lib/queries';
import { useState } from 'react';

export default function PostDetailPage() {
  const { id } = useParams();
  if (!id || isNaN(Number(id))) return <p>不正なIDです</p>;
    // idが数値であることを確認
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
    await refetch(); // コメント再取得
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  const post = data.post;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4">{post.content}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">コメント</h2>
      <ul className="space-y-2 mb-4">
        {post.comments.map((comment: any) => (
          <li key={comment.id} className="border p-2 rounded">
            <p>{comment.content}</p>
            <small className="text-gray-500 text-sm">
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="コメントを入力..."
          className="border p-2 rounded min-h-[80px]"
        />
        <button
          type="submit"
          disabled={posting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          投稿する
        </button>
      </form>
    </main>
  );
}