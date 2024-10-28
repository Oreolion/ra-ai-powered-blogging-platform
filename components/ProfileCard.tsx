"use client";
import Image from "next/image";
import { PostProps, ProfileCardProps } from "@/types";
import LoaderSpinner from "./LoaderSpinner";
// import { Button } from "./ui/button";

const ProfileCard = ({
  postData,
  imageUrl,
  userFirstName,
}: ProfileCardProps) => {
  //   const { setAudio } = useAudio();

//   const [randomPost, setRandomPost] = useState<PostProps | null>(null);

//   const playRandomPost = () => {
//     const randomIndex = Math.floor(Math.random() * postData.posts.length);

//     setRandomPost(postData.posts[randomIndex]);
//   };

  //   useEffect(() => {
  //     if (randomPost) {
  //       setAudio({
  //         title: randomPost.postTitle,
  //         audioUrl: randomPost.audioUrl || "",
  //         imageUrl: randomPost.imageUrl || "",
  //         author: randomPost.author,
  //         postId: randomPost._id,
  //       });
  //     }
  //   }, [randomPost, setAudio]);

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <Image
        src={imageUrl}
        width={160}
        height={160}
        alt="Poster"
        className="aspect-square rounded-lg"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-gray-400">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-gray-400">
            {userFirstName}
          </h1>
        </div>
        <figure className="flex gap-3 py-6">
          <Image
            src='/images/icons8-views-64.png'
            width={24}
            height={24}
            alt="readers"
          />
          <h2 className="text-23 font-semibold text-gray-200">
            {postData?.listeners} &nbsp;
            <span className="font-normal text-gray-200">Readers</span>
          </h2>
        </figure>
      </div>
    </div>
  );
};

export default ProfileCard;
