'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const GET_ALL_POSTS = gql`
  query GetAllPosts{
    allPosts {
      id
      title
      content
    }
  }
`;

export default function Home() {
const { data, loading, error } = useQuery(GET_ALL_POSTS, {
  fetchPolicy: 'network-only',
});
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <main className="p-8">
      <header className='title'>神戸電子7DAYS掲示板</header>
      <h2 className="text-2xl font-bold mb-4">投稿一覧</h2>
      <Link
          href="/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          新規投稿
        </Link>
      <ul className="space-y-4">
        {data.allPosts.map((post: any) => (
          <li key={post.id} className="border p-4 rounded">
                <Link href={`/post/${post.id}`}>
                  <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                    {post.title}
                  </h2>
                </Link>       
              <p className="text-gray-700">{post.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}