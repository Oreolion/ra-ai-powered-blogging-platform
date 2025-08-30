"use client"

import { useState } from "react"
import type { PostCardProps } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import Like from "./post-actions/Like"
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarIcon, Eye, MessageCircle, User } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

const HomeCard = ({
  imageUrl,
  views,
  likes,
  _creationTime,
  postId,
  description,
  category,
  title,
  content,
  authorImageUrl,
  author,
  authorId,
  imageStorageId,
  audioStorageId,
}: PostCardProps) => {
  const [more, setMore] = useState<boolean>(false)
  const router = useRouter()
  const { user } = useUser()
  const postComments = useQuery(api.posts.getComments, {
    postId: postId ?? undefined,
  })
  const updatePostViews = useMutation(api.posts.updatePostViews)

  const handleViews = async () => {
    if (postId) {
      await updatePostViews({ postId })
      router.push(`/post/${postId}`, {
        scroll: true,
      })
    } else {
      console.error("postId is undefined")
    }
  }

  const formatDate = (creationTime: number) => {
    const date = new Date(Math.floor(creationTime))
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <article className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/20 cursor-pointer">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${user?.id}`} className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden ring-2 ring-slate-600 hover:ring-orange-500 transition-all duration-200">
              {authorImageUrl ? (
                <Image
                  src={authorImageUrl || "/placeholder.svg"}
                  alt="Author"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-orange-400" />
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${user?.id}`}
              className="text-white font-semibold hover:text-orange-400 transition-colors duration-200 block truncate text-lg"
            >
              {author}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <time dateTime={new Date(_creationTime).toISOString()} className="text-sm text-slate-400">
                {formatDate(_creationTime)}
              </time>
            </div>
          </div>
        </div>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30 transition-colors duration-200 h-8 min-w-[7rem] max-w-[11rem]">
          {category}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-100 transition-colors duration-200 uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg font-medium capitalize">
            {more ? description : description.substring(0, 100)}
            {description.length > 100 && (
              <div
                onClick={handleViews}
                className="text-orange-400 hover:text-orange-300 font-bold ml-1 transition-colors duration-200 text-xs"
              >
                ...
              </div>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <p className="text-slate-300 leading-relaxed">
              {more ? content : content.substring(0, 150)}
              {content.length > 150 && (
                <Button
                  onClick={handleViews}
                  className="text-orange-400 hover:text-orange-300 font-bold ml-2 transition-colors duration-200 text-xs"
                >
                  Continue reading...
                </Button>
              )}
            </p>
          </div>

          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-700">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Post thumbnail"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-orange-500/30 border-b-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors duration-200">
            <Eye className="h-5 w-5" />
            <span className="font-medium">{views}</span>
          </div>

          <div
            onClick={handleViews}
            className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors duration-200"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{postComments?.length || 0}</span>
          </div>
        </div>

        <div className="flex items-center">
          <Like likes={likes} postId={postId} />
        </div>
      </div>
    </article>
  )
}

export default HomeCard
