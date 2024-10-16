"use client";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import styles from "@/styles/homefeeds.module.css";
import Like from "@/components/post-actions/Like";
import HomeCard from "@/components/HomeCard";
import { PostComments } from "@/components/PostComments";
import Delete from "@/components/post-actions/Delete";
import { CopyLink } from "@/components/post-actions/CopyLink";
import Saved from "@/components/post-actions/Saved";
import Comment from "@/components/post-actions/Comment";
import {Share} from "@/components/post-actions/Share";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareModal from "@/components/ShareModal";

const PostDetails = ({
  params: { postId },
}: {
  params: { postId: Id<"posts"> };
}) => {
  const [toggleComment, setToggleComment] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { user } = useUser();

  const post = useQuery(api.posts.getPostById, {
    postId: postId,
  });
  const postComments = useQuery(api.posts.getComments, {
    // @ts-ignore
    postId,
  });

  const similarPosts = useQuery(api.posts.getPostByPostCategory, {
    postId: postId,
  });

  const formatDate = (creationTime: number) => {
    const date = new Date(Math.floor(creationTime));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //   const isOwner = user?.id === post?.authorId;

  if (!similarPosts || !post) return <LoaderSpinner></LoaderSpinner>;

  if (!postId) {
    return <LoaderSpinner />;
  }

  const handleToggleCommentBox = () => {
    setToggleComment(!toggleComment);
  };

  return (
    <section className="ml-[9rem] mt-[9rem] max-md:ml-[0]">
      <article className={`${styles.post} ${styles.postdetails}`}>
        <div className={styles.user__profile}>
          <Link href={`/profile/${user?.id}`} className={styles.user__image}>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={post.authorImageUrl || "/placeholder-avatar.jpg"}
                alt={post.author}
              />
              <AvatarFallback>{post.author?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className={styles.user__info}>
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/profile/${user?.id}`}
                className={styles.username}
              >
                {post.author}
              </Link>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1 h-6 w-6" />
                <time dateTime={new Date(post._creationTime).toISOString()}>
                  {formatDate(post._creationTime)}
                </time>
              </div>
            </div>

            <Badge className="mb-4 h-8 min-w-[7rem] max-w-[11rem]">
              {post.postCategory}
            </Badge>
          </div>
        </div>

        <div className={styles.postheader}>
          <h2 className={styles.h2}> {post?.postTitle} </h2>
          <p className={styles.desc}> {post?.postDescription} </p>
        </div>
        <div className={styles.postimage}>
          <Image src={post?.imageUrl} alt="thumbnail" width={230} height={46} />
        </div>
        <p
          className={`${styles.p} prose prose-li:marker:text-green-500 prose-img:rounded-lg prose-headings:underline prose-a:text-blue-600 lg:prose-xl`}
        >
          {" "}
          {post?.postContent}{" "}
        </p>

        <div className={styles.reactionbox}>
          <div className={styles.left}>
            <div className={styles.user}>
              <Image
                src="/images/icons8-views-64.png"
                alt="views"
                width={30}
                height={30}
              />
              <span className={styles.span}>{post?.views} </span>
            </div>
          </div>
          <div className={styles.right}>
            <Saved post={post} audioStorageId={post?.audioStorageId}></Saved>
            <Delete
              postId={post?._id}
              imageStorageId={post?.imageStorageId}
              audioStorageId={post?.audioStorageId}
            ></Delete>
            <CopyLink></CopyLink>
            <Share onOpenModal={() => setIsShareModalOpen(true)} />
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              postUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/post/${postId}`}
              postTitle={post?.postTitle}
            />
            <div
              onClick={handleToggleCommentBox}
              className={`${styles.icon} mt-[-4px]`}
            >
              <Comment></Comment>
              <span className="ml-4">{postComments?.length} </span>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <Like likes={post?.likes} postId={post._id}></Like>
            </div>
          </div>
        </div>
        {toggleComment && <PostComments postId={postId}></PostComments>}
      </article>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-[1.8rem] font-bold text-white-1">Similar Posts</h1>
        {similarPosts && similarPosts.length > 0 ? (
          <div className="">
            {similarPosts?.map(
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
                  />
                );
              }
            )}
          </div>
        ) : (
          <>
            <EmptyStates
              title="No Similar post Found"
              buttonLink="/dashboard"
              buttonText="Discover more posts"
            ></EmptyStates>
          </>
        )}
      </section>
    </section>
  );
};

export default PostDetails;
