"use client";

import React from 'react'
import { SignedIn, useClerk } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';


const Page = () => {
    const { signOut } = useClerk();
    const router = useRouter()

  return (
    <>
    <h1>This is the dashboard</h1>

    

      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <button
          type='button'
            onClick={() => signOut(() => router.push("/sign-in"))}
            className="text-16 w-full bg-orange-1 font-extrabold"
          >
            Log Out
          </button>
        </div>
      </SignedIn>
    </>
  )
}

export default Page;