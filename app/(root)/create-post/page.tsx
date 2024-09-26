import dynamic from 'next/dynamic'

const AddBlogPost = dynamic(() => import('@/components/AddBlogPost'), { ssr: false })

export default function CreatePostPage() {
  return (
    <div>
      <AddBlogPost />
    </div>
  )
}