"use client";
import React, { useEffect, useState  } from "react";
import styles from "@/styles/homefeeds.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "./Loader";
import HomeCard from "./HomeCard";
import EmptyStates from "@/components/EmptyStates";
import SearchBar from "./SearchBar";

const HomeFeeds = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const posts = useQuery(api.posts.getAllPosts);
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const searchData = useQuery(api.posts.getPostBySearch, {
    search: search || "",
  });

  useEffect(() => {
    setIsLoading(false);
  }, [posts]);

  const handleTogglePostInput = () => {
    router.push("/create-post");
  };

  return (
    <>
      <SearchBar />
      <section className={styles.dashboard__feeds}>
        <div className={styles.dashboardfeeds__header}>
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
        <div className={styles.dashboardfeeds__nav}>
          <h3 className={styles.h3}>FOR YOU</h3>
          <h3 className={styles.h3}>FEATURED</h3>
          <h3 className={styles.h3}>RECENT</h3>
        </div>
        <div className={styles.post__box}>
          {isLoading ? (
            <Loader />
          ) : search ? (
            searchData?.length > 0 ? (
              searchData?.map(
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
                  />
                )
              )
            ) : (
              <EmptyStates title="No results found" />
            )
          ) : (
            posts?.map(
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
                />
              )
            )
          )}
        </div>
      </section>
    </>
  );
};

export default HomeFeeds;
