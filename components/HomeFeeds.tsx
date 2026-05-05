"use client"
import { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import HomeCard from "./HomeCard"
import EmptyStates from "@/components/EmptyStates"
import dynamic from "next/dynamic"
import { Plus, Flame, Sparkles, Clock, Users } from "lucide-react"
import Pagination from "./Pagination"
import SkeletonLoader from "./SkeletonLoader"

const SearchBar = dynamic(() => import("@/components/SearchBar"), { ssr: false })

type FeedTab = "FOR YOU" | "FEATURED" | "RECENT" | "FOLLOWING"

const TABS: { label: FeedTab; icon: React.ReactNode }[] = [
  { label: "FOR YOU", icon: <Sparkles className="w-4 h-4" /> },
  { label: "FEATURED", icon: <Flame className="w-4 h-4" /> },
  { label: "RECENT", icon: <Clock className="w-4 h-4" /> },
  { label: "FOLLOWING", icon: <Users className="w-4 h-4" /> },
]

const HomeFeeds = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<FeedTab>("FOR YOU")

  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""

  const postsData = useQuery(api.posts.getAllPostsPaginated, {
    page: currentPage,
    limit: postsPerPage,
  })
  const searchData = useQuery(api.posts.getPostBySearchPaginated, {
    search,
    page: currentPage,
    limit: postsPerPage,
  })
  const followingPosts = useQuery(api.posts.getPostsByFollowing)
  const trendingPosts = useQuery(api.posts.getTrendingPosts)

  useEffect(() => {
    setIsLoading(true)
    const allLoaded =
      postsData !== undefined &&
      searchData !== undefined &&
      followingPosts !== undefined &&
      trendingPosts !== undefined
    if (allLoaded) {
      setIsLoading(false)
    }
  }, [postsData, searchData, followingPosts, trendingPosts, currentPage, search])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeTab])

  const handleTogglePostInput = () => {
    router.push("/create-post")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const displayPosts = useMemo(() => {
    if (search) {
      return searchData?.posts || []
    }

    const allPosts = postsData?.posts || []

    switch (activeTab) {
      case "FOR YOU": {
        // Mix: 50% trending, 50% recent
        const trending = trendingPosts || []
        const mixed = [...trending.slice(0, 5), ...allPosts.slice(0, 5)]
        // Deduplicate by _id
        const seen = new Set()
        return mixed.filter((post) => {
          if (seen.has(post._id)) return false
          seen.add(post._id)
          return true
        })
      }
      case "FEATURED": {
        return trendingPosts || []
      }
      case "FOLLOWING": {
        return followingPosts || []
      }
      case "RECENT":
      default: {
        return allPosts
      }
    }
  }, [search, activeTab, postsData, searchData, followingPosts, trendingPosts])

  const paginationInfo = search
    ? searchData
      ? {
          currentPage: searchData.currentPage,
          totalPages: searchData.totalPages,
          hasNextPage: searchData.hasNextPage,
          hasPrevPage: searchData.hasPrevPage,
        }
      : null
    : postsData
      ? {
          currentPage: postsData.currentPage,
          totalPages: postsData.totalPages,
          hasNextPage: postsData.hasNextPage,
          hasPrevPage: postsData.hasPrevPage,
        }
      : null

  return (
    <>
      <SearchBar />
      <div className="pt-24 pb-8 px-4 lg:px-8 md:pt-[13rem] max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-wide">FEEDS</h1>
              <p className="text-slate-300 text-lg max-w-md">
                Explore different contents you will love
              </p>
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
          <div className="flex gap-1 p-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 w-fit overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.label
                    ? "text-orange-400 bg-slate-700/70 shadow-inner"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <SkeletonLoader />
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
                  likes={likes ?? 0}
                  author={author}
                  authorImageUrl={authorImageUrl}
                  _creationTime={_creationTime}
                  shouldNavigate={false}
                />
              ),
            )
          ) : (
            <EmptyStates
              title={
                activeTab === "FOLLOWING"
                  ? "No posts from people you follow"
                  : "No results found"
              }
              buttonLink="/dashboard"
              buttonText={
                activeTab === "FOLLOWING" ? "Discover posts" : "Browse all posts"
              }
            />
          )}
        </div>

        {paginationInfo && paginationInfo.totalPages > 1 && activeTab === "RECENT" && (
          <Pagination
            currentPage={paginationInfo.currentPage}
            totalPages={paginationInfo.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={paginationInfo.hasNextPage}
            hasPrevPage={paginationInfo.hasPrevPage}
          />
        )}
      </div>
    </>
  )
}

export default HomeFeeds
