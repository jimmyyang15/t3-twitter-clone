import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEditProfileModal } from "../../../lib/zustand";
import Avatar from "../../components/Avatar";
import Body from "../../components/Body";
import NavFeed from "../../components/NavFeed";
import { trpc } from "../../utils/trpc";
import { IoLocation } from "react-icons/io5";
import { IoIosCalendar } from "react-icons/io";
import moment from "moment";
import { AiOutlineLink } from "react-icons/ai";
import Link from "next/link";
import TweetList from "../../components/TweetList";
import { TweetWithUser } from "../../../interface";
import Loader from "../../components/Loader";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setModal } = useEditProfileModal();
  const [_link, setLink] = useState<string>("");

  const tweetLinks = [
    {
      name: "Tweets",
      slug: "",
    },
    {
      name: "Tweets & replies",
      slug: "tweets&replies",
    },
    {
      name: "Media",
      slug: "media",
    },
    {
      name: "Likes",
      slug: "likes",
    },
  ];

  const { username, userId } = router.query;

  const { data: userTweets, isLoading: isLoadingUserTweets } =
    trpc.tweet.getUserTweets.useQuery({
      userId: userId as string,
      link: _link,
    });
  const { data: userProfile, isLoading: isLoadingUserProfile } =
    trpc.user.getUserProfile.useQuery({
      userId: userId as string,
    });
  const { data: userTweetsCount } = trpc.tweet.getUserTweets.useQuery({
    userId: userId as string,
    link: "tweets&replies",
  });

  if (isLoadingUserProfile) return <Loader />;

  console.log(userProfile);

  return (
    <Body>
      <NavFeed tweets={userTweetsCount?.length} title={username as string} />
      <div className="relative h-48 w-full">
        <div className="relative h-full w-full bg-gray-200">
          {userProfile?.profile?.coverPhoto ? (
            <Image
              objectFit="cover"
              src={userProfile.profile.coverPhoto}
              layout="fill"
            />
          ) : null}
        </div>
      </div>
      <div className="flex items-start justify-between px-2 md:px-4 ">
        <div className="-mt-16 ">
          <Avatar
            image={userProfile?.image as string}
            width={140}
            height={140}
          />
        </div>
        {session?.user?.id === userId ? (
          <button
            onClick={() => setModal(true)}
            className="mt-4 whitespace-nowrap rounded-full border border-gray-300 bg-transparent px-2 py-1 text-xs font-semibold hover:bg-gray-200 sm:px-4 sm:py-2 sm:text-base"
          >
            Edit profile
          </button>
        ) : null}
      </div>
      <div className="p-2 md:p-4">
        <p className="text-lg font-bold md:text-2xl">{userProfile?.name}</p>
        <p className="text-gray-400">{userProfile?.email}</p>
        <p className="text-xs md:text-sm">
          {userProfile?.profile?.bio || "No bio added"}
        </p>

        <div className="mt-4 flex flex-col items-start gap-x-4 text-sm text-gray-500 sm:flex-row sm:items-center md:text-base">
          <div className="flex items-center gap-x-2">
            <IoLocation />
            <p>{userProfile?.profile?.location}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <AiOutlineLink />
            <Link
              className="text-blue-500 hover:underline"
              target="_blank"
              href={(userProfile?.profile?.website as string) ?? ""}
            >
              {userProfile?.profile?.website}
            </Link>
          </div>

          <div className="flex items-center gap-x-2">
            <IoIosCalendar />
            <p>
              Joined in {moment(userProfile?.createdAt as Date).format("ll")}
            </p>
          </div>
        </div>
      </div>
      <nav className="mt-4 flex list-none items-center justify-between gap-x-2 whitespace-nowrap px-2 text-xs font-semibold xs:text-sm sm:gap-x-4 md:px-4 md:text-base">
        {tweetLinks.map((link) => (
          <li
            className={`cursor-pointer text-gray-500 ${
              link.slug === _link ? "border-b-2 border-blue-500" : null
            }`}
            onClick={() => setLink(link.slug)}
          >
            {link.name}
          </li>
        ))}
      </nav>
      {!isLoadingUserTweets ? (
        <>
          {userTweets?.length !== 0 ? (
            <TweetList tweets={userTweets as TweetWithUser[]} />
          ) : (
            <h1 className="flex items-center justify-center py-16  text-2xl font-bold">
              No tweets
            </h1>
          )}
        </>
      ) : (
        <Loader />
      )}
    </Body>
  );
};

export default ProfilePage;
