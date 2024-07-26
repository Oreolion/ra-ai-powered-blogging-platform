import React, { Suspense } from "react";
import HomeFeeds from "@/components/HomeFeeds";
import { Loader } from "lucide-react";

const Page = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <HomeFeeds></HomeFeeds>
      </Suspense>
    </>
  );
};

export default Page;
