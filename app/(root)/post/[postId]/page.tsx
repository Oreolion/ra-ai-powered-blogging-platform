"use client";

// import PostDetailPlayer from "@/components/PostDetailPlayer";
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
import { Share } from "@/components/post-actions/Share";
import Saved from "@/components/post-actions/Saved";
import Comment from "@/components/post-actions/Comment";
import Link from "next/link";

const PostDetails = ({
  params: { postId },
}: {
  params: { postId: Id<"posts"> };
}) => {
  const [toggleComment, setToggleComment] = useState<boolean>(false);

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

  //   const isOwner = user?.id === post?.authorId;

  if (!similarPosts || !post) return <LoaderSpinner></LoaderSpinner>;

  if (!postId) {
    return <LoaderSpinner />;
  }

  const handleToggleCommentBox = () => {
    setToggleComment(!toggleComment);
  };

  return (
    <section className="ml-[18rem] mt-[9rem] max-md:ml-[0]">
      <article
        className={`${styles.post} ${styles.postdetails}`}
        // v-if="!isLoading"
      >
        <div className={styles.user__profile}>
          <Link href={`/profile/${user?.id}`} className={styles.user__image}>
            {!post?.authorImageUrl ? (
              <span className={styles.span}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={styles.svg}
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </span>
            ) : (
              <Image
                src={post?.authorImageUrl}
                alt="userpicture"
                width={30}
                height={30}
              />
            )}
          </Link>
          <div className={styles.user__info}>
            <div className="flex justify-between">
              <h3 className={styles.username}> {post?.author}</h3>
              <p className={styles.p1}>
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                {post?._creationTime}
              </p>
            </div>

            <div className="flex flex-col">
              <p className={styles.userrole}>{post?.postCategory}</p>

              <p className={styles.p}> {post?.postDescription} </p>
            </div>
          </div>
        </div>

        <div className={styles.postheader}>
          <h2 className={styles.h2}> {post?.postTitle} </h2>
          <p className={styles.p}> {post?.postContent} </p>
        </div>
        <div className={styles.postimage}>
          <Image src={post?.imageUrl} alt="thumbnail" width={230} height={46} />
        </div>

        <div className={styles.reactionbox}>
          <div className={styles.left}>
            <div className={styles.user}>
              <Image
                src="/images/icons8-views-64.png"
                alt="views"
                width={30}
                height={30}
              />
              <span className={styles.span}>{post?.views} views</span>
            </div>
          </div>
          <div className={styles.right}>
            <Saved post={post} audioStorageId={post?.audioStorageId}></Saved>
            <Delete
              postId={post?._id}
              imageStorageId={post?.imageStorageId}
              audioStorageId={post?.audioStorageId}
            ></Delete>
            <Share></Share>
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
