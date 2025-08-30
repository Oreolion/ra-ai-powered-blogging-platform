"use client"
import LoaderSpinner from "@/components/LoaderSpinner"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import HomeCard from "@/components/HomeCard"
import SearchBar from "@/components/SearchBar"
import Link from "next/link"
import { Button } from "./ui/button"

export default function SavedPost() {
  const { user } = useUser()
  let allSavedPosts = useQuery(api.posts.getAllSavedPosts)
  const getUserById = useQuery(api.users.getUserById, {
    clerkId: user?.id,
  })

  allSavedPosts = []
  // Handle loading state
  if (allSavedPosts === undefined || getUserById === undefined) {
    return <LoaderSpinner />
  }

  // Ensure data is fetched before rendering
  if (!user || !getUserById || !allSavedPosts) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <SearchBar />

        {user?.id === getUserById?.clerkId ? (
          <div className="flex flex-col gap-10 mt-[7rem]">
            {allSavedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      fill="currentColor"
                    >
                      <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-200">No Saved Posts</h2>
                  <p className="text-slate-400 max-w-md">
                    You haven&apos;t saved any posts yet. Start exploring and bookmark posts you&apos;d like to read later.
                  </p>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                  <Link href="/dashboard">Explore Posts</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-200">Saved Posts</h1>
                  <span className="text-slate-400">{allSavedPosts.length} posts saved</span>
                </div>

                <div className="grid gap-6">
                  {allSavedPosts.map(
                    ({
                      _id,
                      postId,
                      views,
                      likes,
                      postCategory,
                      postTitle,
                      postDescription,
                      postContent,
                      authorImageUrl,
                      imageUrl,
                      author,
                      _creationTime,
                      imageStorageId,
                      audioStorageId,
                    }) => {
                      return (
                        <HomeCard
                          key={postId}
                          imageUrl={imageUrl!}
                          title={postTitle!}
                          description={postDescription}
                          category={postCategory}
                          content={postContent}
                          postId={postId}
                          views={views}
                          likes={likes}
                          author={author}
                          authorImageUrl={authorImageUrl}
                          _creationTime={_creationTime}
                          imageStorageId={imageStorageId}
                          audioStorageId={audioStorageId}
                        />
                      )
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-200">Private Collection</h2>
              <p className="text-slate-400 max-w-md">
                {getUserById?.name}&apos;s saved posts are private and cannot be viewed by others.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
