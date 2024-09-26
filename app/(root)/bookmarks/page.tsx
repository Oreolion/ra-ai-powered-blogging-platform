import dynamic from 'next/dynamic'

const SavedPosts = dynamic(()=> import('@/components/SavedPosts'), { ssr: true })

export default function Page () {
  return (
    <>
      <SavedPosts />
    </>
  );
};

