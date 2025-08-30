"use client"

import { useEffect, useState } from "react"
import LoaderSpinner from "./LoaderSpinner"
import { useUser } from "@clerk/nextjs"
import { useToast } from "./ui/use-toast"
import type { PostCommentsArrayType } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
// import { useTimeAgo } from "../custom-hooks/useTimeAgo";
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MdModeEdit, MdOutlineDelete } from "react-icons/md"
import type { Id } from "@/convex/_generated/dataModel"

export const PostComments = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<PostCommentsArrayType>([])
  const [toggleComment, setToggleComment] = useState<boolean>(true)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)

  const [more, setMore] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editComment, setEditComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const addComment = useMutation(api.posts.createComment)
  const deleteComment = useMutation(api.posts.deleteComment)
  const editCommentMutation = useMutation(api.posts.editComment)
  const postComments = useQuery(api.posts.getComments, { postId })
  const userId = useQuery(api.users.getUserById, { clerkId: user?.id })

  useEffect(() => {
    setComments(postComments)
  }, [postComments])

  const createComment = async () => {
    try {
      setLoading(true)
      if (comment === "" && user) {
        toast({
          title: "The Input field is required",
          variant: "destructive",
        })
        return
      }
      if (user) {
        await addComment({
          postId,
          content: comment,
        })

        toast({
          title: "You added a comment",
        })
        setComment("")
      } else {
        router.push("/sign-in")
      }
    } catch (error) {
      toast({
        title: "Error Adding Comment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeComment = async (commentId: string) => {
    try {
      // Add the mutation to delete the comment from the database
      if (user) {
        await deleteComment({
          _id: commentId,
        })
      }
      toast({
        title: "Comment has been removed",
      })
    } catch (error) {
      toast({
        title: "Error occurred while removing comment",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async ({
    _id,
    newContent,
  }: {
    _id: Id<"comments">
    newContent: string
  }) => {
    setIsLoading(true)
    try {
      if (user && userId) {
        await editCommentMutation({
          _id,
          newContent,
          userId: userId?._id,
        })
        setEditComment("")
        setIsEdit(false)
        toast({
          title: "Comment edited successfully",
        })
      }
    } catch (error) {
      console.error("Error occurred while editing comment:", error)
      toast({
        title: "Error occurred while editing comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      {toggleComment && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mt-6">
          {comments && comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li className="bg-slate-900/50 border border-slate-700 rounded-lg p-4" key={comment.userId}>
                  <div className="flex items-center gap-3 mb-3">
                    {comment.commentUserImage ? (
                      <Image
                        src={comment.commentUserImage || "/placeholder.svg"}
                        alt="userpicture"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 fill-current text-slate-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                      </div>
                    )}
                    <p className="font-medium text-slate-200">{comment.username}</p>
                  </div>

                  <div className="bg-slate-800/70 border border-slate-600 rounded-lg p-3 mb-3">
                    <p className="text-slate-200 leading-relaxed">
                      {more ? comment.content : comment.content.substring(0, 100)}
                      {comment.content.length > 100 && (
                        <button
                          type="button"
                          onClick={() => setMore(!more)}
                          className="ml-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
                        >
                          {more ? "...less" : "...more"}
                        </button>
                      )}
                    </p>
                  </div>

                  {user && userId?._id === comment.userId && (
                    <div className="flex gap-3">
                      <MdModeEdit
                        size={20}
                        onClick={() => {
                          setIsEdit(true)
                          setEditComment(comment.content)
                          setEditingCommentId(comment._id)
                        }}
                        className="text-slate-400 hover:text-orange-400 cursor-pointer transition-colors"
                      />
                      <MdOutlineDelete
                        size={20}
                        onClick={() => removeComment(comment._id)}
                        className="text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-slate-400">Be the First to Comment</div>
          )}

          {!isEdit ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {userId?.imageUrl ? (
                    <Image
                      src={userId?.imageUrl || "/placeholder.svg"}
                      alt="userpicture"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 fill-current text-slate-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <textarea
                    className="w-full bg-slate-800/70 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                    placeholder="What are your thoughts?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  type="button"
                  onClick={() => setToggleComment(!toggleComment)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={createComment}
                  disabled={loading}
                >
                  {loading ? <LoaderSpinner /> : "Comment"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <textarea
                rows={3}
                value={editComment}
                placeholder="What are your thoughts?"
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full bg-slate-800/70 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingCommentId && editComment) {
                      handleEdit({
                        _id: editingCommentId,
                        newContent: editComment,
                      })
                    }
                  }}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {!isLoading ? "Update" : <LoaderSpinner />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
