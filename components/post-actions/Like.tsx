"use client"

import { useNumFormatter } from "@/custom-hooks/useNumberFormatter"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { FcLike, FcLikePlaceholder } from "react-icons/fc"
import { useToast } from "../ui/use-toast"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"

const Like = ({ likes, postId }: { likes: number; postId: string }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeBounce, setLikeBounce] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const formattedNumber = useNumFormatter(likeCount)
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (likes) {
      setLikeCount(likes)
      setIsLiked(likes > 0)
    }
  }, [likes])

  const updatePostLikes = useMutation(api.posts.updatePostLikes)

  const handleLike = async () => {
    try {
      if (user) {
        const increment = !isLiked
        setIsLiked(increment)
        setLikeCount(increment ? likeCount + 1 : likeCount - 1)

        await updatePostLikes({ postId, increment })

        setLikeBounce(true)

        setTimeout(() => {
          setLikeBounce(false)
        }, 5000)
      } else {
        router.push("/sign-in")
      }
    } catch (error) {
      toast({
        title: "Error occured while liking post",
        variant: "destructive",
      })
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1)
    }
  }

  return (
    <div className="mt-[-1.2rem] flex items-center ml-[-2rem] cursor-pointer" onClick={handleLike}>
      {isLiked ? (
        <FcLike
          size={30}
          className={`opacity-50 hover:opacity-100 transition-all duration-200 ${likeBounce ? "scale-110" : ""}`}
        />
      ) : (
        <FcLikePlaceholder size={30} className="opacity-50 hover:opacity-100 transition-all duration-200" />
      )}
      <span className="text-xl ml-2 text-slate-300">{formattedNumber}</span>
    </div>
  )
}

export default Like
