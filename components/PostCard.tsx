import React from "react";
import styles from "@/styles/homefeeds.module.css";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PostCardProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PostCard = ({
  imageUrl,
  views,
  _creationTime,
  postId,
  description,
  category,
  title,
  content,
  authorImageUrl,
  author,
}: PostCardProps) => {
  const posts = useQuery(api.posts.getAllPosts);
  const router = useRouter();

  const handleViews = () => {
    // increase views
    router.push(`/posts/${postId}`, {
      scroll: true,
    });
  };

  return (
    <>
      <article
        className={styles.post}
        key={title}
        v-if="!isLoading"
        onClick={handleViews}
        // onClick={handleBlogDetails(post, index)}
      >
        <div className={styles.user__profile}>
          <div className={styles.user__image}>
            {authorImageUrl ? (
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
          </div>
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
            <button type="button" className={styles.icon}>
              <svg
                className={styles.svg}
                fill="#ccc"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
              </svg>
              {/* <span>{{ commentLists.length }} </span> */}
            </button>
            <button
              className={styles.icon}
              type="button"
              //  onClick={onLike}
            >
              <svg
                className={styles.svg}
                fill="#ccc"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </svg>
              {/* <span>{{ likeLists.length }} </span> */}
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostCard;
