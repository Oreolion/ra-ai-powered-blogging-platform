import React from "react";
import styles from "@/styles/homefeeds.module.css";
// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
import { PostCardProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Like from "./post-actions/Like";
import { PostComments } from "./PostComments";
import { Tab, Tabs } from "./Tabs";

const PostCard = ({
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
}: PostCardProps) => {
  //   const posts = useQuery(api.posts.getAllPosts);
  const router = useRouter();
  const { user } = useUser();

  const tabs: Tab[] = [
    {
      title: "Comments",
      color: "#000",
      content: (
        <div className="mt-[-5rem] flex flex-col gap-10">
          <PostComments postId={postId as string} />
        </div>
      ),
    },
  ];

  return (
    <>
      <article
        className={styles.post}
        // v-if="!isLoading"
      >
        <div className={styles.user__profile}>
          <Link href={`/profile/${user?.id}`} className={styles.user__image}>
            {!authorImageUrl ? (
              <span
                className={styles.span}
                //   v-if="!authorImageUrl"
              >
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
                src={authorImageUrl}
                alt="userpicture"
                width={30}
                height={30}
              />
            )}
          </Link>
          <div className={styles.user__info}>
            <div className="">
              <h3 className={styles.username}>Name: {author}</h3>
              <p className={styles.p1}>
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                {_creationTime}
              </p>
            </div>

            <div className="flex flex-col">
              <p className={styles.userrole}>{category}</p>

              <p className={styles.p}> {description} </p>
            </div>
          </div>
        </div>

        <div className={styles.postheader}>
          <h2 className={styles.h2}> {title} </h2>
          <p className={styles.p}> {content} </p>
        </div>
        <div className={styles.image}>
          <Image src={imageUrl} alt="thumbnail" width={230} height={46} />
        </div>

        <div className={styles.reactionbox}>
          <div className={styles.left}>
            <div className={styles.user}>
              <svg
                className={styles.svg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
              <span className={styles.span}>{views} views</span>
            </div>
          </div>
          <div className={styles.right}>
            <Tabs tabs={tabs} />
            <div className="flex gap-2 items-center justify-center">
              <Like likes={likes} postId={postId}></Like>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostCard;
