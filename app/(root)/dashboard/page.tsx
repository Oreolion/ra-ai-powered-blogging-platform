import React, { Suspense } from "react";
import HomeFeeds from "@/components/HomeFeeds";
// import LoaderSpinner from "@/components/LoaderSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

const Page = () => {
  return (
    <>
      <Suspense fallback={<SkeletonLoader />}>
        <HomeFeeds></HomeFeeds>
      </Suspense>
    </>
  );
};

export default Page;
