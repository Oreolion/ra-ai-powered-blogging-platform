import React, { Suspense } from "react";
import HomeFeeds from "@/components/HomeFeeds";
import LoaderSpinner from "@/components/LoaderSpinner";

const Page = () => {
  return (
    <>
      <Suspense fallback={<LoaderSpinner />}>
        <HomeFeeds></HomeFeeds>
      </Suspense>
    </>
  );
};

export default Page;
