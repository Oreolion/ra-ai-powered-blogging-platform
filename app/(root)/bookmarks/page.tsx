import dynamic from 'next/dynamic'

const SavedPosts = dynamic(()=> import('@/components/SavedPosts'), { ssr: false })

export default function Page () {
  return (
    <>
      <SavedPosts />
    </>
  );
};

