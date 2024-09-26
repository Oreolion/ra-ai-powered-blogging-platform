import dynamic from 'next/dynamic'

const AddBlogPost = dynamic(() => import('@/components/AddBlogPost'), { ssr: true })

export default function CreatePostPage() {
  return (
    <div>
      <AddBlogPost />
    </div>
  )
}