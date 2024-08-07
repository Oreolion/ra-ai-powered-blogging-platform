import dynamic from 'next/dynamic'

const AddBlogPost = dynamic(() => import('@/components/AddBlogPost'), { ssr: false })

export default function CreatePostPage() {
  return (
    <div>
      <h1>Create a New Post</h1>
      <AddBlogPost />
    </div>
  )
}