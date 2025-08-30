"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "./Loader"
import HomeCard from "./HomeCard"
import EmptyStates from "@/components/EmptyStates"
import dynamic from "next/dynamic"
import { Plus } from "lucide-react"

const SearchBar = dynamic(() => import("@/components/SearchBar"), { ssr: false })

const HomeFeeds = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""

  const posts = useQuery(api.posts.getAllPosts)
  const searchData = useQuery(api.posts.getPostBySearch, { search })

  useEffect(() => {
    if (posts !== undefined && searchData !== undefined) {
      setIsLoading(false)
    }
  }, [posts, searchData])

  const handleTogglePostInput = () => {
    router.push("/create-post")
  }

  const displayPosts = search ? searchData : posts

  return (
    <>
      <SearchBar />
      <div className="pt-24 pb-8 px-4 lg:px-8 md:pt-[13rem] max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-wide">FEEDS</h1>
              <p className="text-slate-300 text-lg max-w-md">Explore different contents you will love</p>
            </div>
            <button
              onClick={handleTogglePostInput}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-orange-500/25"
            >
              <Plus className="h-5 w-5" />
              Post a content
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 w-fit">
            {["FOR YOU", "FEATURED", "RECENT"].map((tab) => (
              <button
                key={tab}
                className="px-6 py-3 text-sm font-bold text-orange-400 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-200 hover:scale-105"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <Loader />
          ) : displayPosts && displayPosts.length > 0 ? (
            displayPosts.map(
              ({
                _id: postId,
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
              }) => (
                <HomeCard
                  key={postId.toString()}
                  imageUrl={imageUrl}
                  title={postTitle}
                  description={postDescription}
                  category={postCategory}
                  content={postContent}
                  postId={postId}
                  views={views}
                  likes={likes}
                  author={author}
                  authorImageUrl={authorImageUrl}
                  _creationTime={_creationTime}
                  shouldNavigate={false}
                />
              ),
            )
          ) : (
            <EmptyStates title="No results found" />
          )}
        </div>
      </div>
    </>
  )
}

export default HomeFeeds;