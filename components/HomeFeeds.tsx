"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/homefeeds.module.css";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "./Loader";
import PostCard from "./PostCard";

const HomeFeeds = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const posts = useQuery(api.posts.getAllPosts);

  useEffect(() => {
    setIsLoading(false);
  }, [posts]);

  const handleTogglePostInput = () => {
    router.push("/create-post");
  };

  return (
    <>
      <section className={styles.dashboard__feeds}>
        <div className={styles.dashboardfeeds__header} v-if="!togglePostInput">
          <div className={styles.leftbox}>
            <h1 className={styles.h1}>FEEDS</h1>
            <p className={styles.p}>Explore different contents you will love</p>
          </div>
          <button
            className={styles.button}
            type="button"
            onClick={handleTogglePostInput}
          >
            Post a content
          </button>
        </div>
        <div className={styles.dashboardfeeds__nav} v-if="!togglePostInput">
          <h3 className={styles.h3}>FOR YOU</h3>
          <h3 className={styles.h3}>FEATURED</h3>
          <h3 className={styles.h3}>RECENT</h3>
        </div>

        <div className={styles.post__box}>
          {posts && !isLoading ? (
            <>
              {posts?.map(
                ({
                    postId,
                  views,
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
                    <>
                      <PostCard
                        key={postId}
                        imageUrl={imageUrl!}
                        title={postTitle!}
                        description={postDescription}
                        category={postCategory}
                        content={postContent}
                        postId={postId}
                        views={views}
                        author={author}
                        authorImageUrl={authorImageUrl}
                        _creationTime={_creationTime}
                      />{" "}
                    </>
                  );
                }
              )}
            </>
          ) : (
            <>
              <Loader></Loader>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HomeFeeds;
