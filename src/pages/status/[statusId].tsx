import { Prisma, Tweet } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiOutlineRetweet,
} from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { v4 } from "uuid";
import useLikeTweet from "../../../hooks/useLikeTweet";
import useRetweet from "../../../hooks/useRetweet";
import {
  LikesWithPayloads,
  RetweetsWithPayloads,
  TweetWithUser,
} from "../../../interface";
import {
  useLikesModal,
  useReplyModal,
  useRetweetsModal,
  useTweetId,
  useUserLikes,
  useUserRetweets,
} from "../../../lib/zustand";
import Avatar from "../../components/Avatar";
import Body from "../../components/Body";
import Loader from "../../components/Loader";
import NavFeed from "../../components/NavFeed";
import ReplyForm from "../../components/ReplyForm";
import TweetComponent from "../../components/TweetComponent";
import { trpc } from "../../utils/trpc";

const StatusPage = () => {
  const router: any = useRouter();
  const { status } = useSession();
  const { statusId } = router.query;

  const { data: tweetDetails, isLoading } = trpc?.tweet.getSingleTweet.useQuery(
    {
      tweetId: statusId,
    }
  );

  console.log(tweetDetails?.retweets);

  const { data: replies } = trpc?.tweet.getTweetReplies.useQuery({
    tweetId: statusId,
  });

  const { alreadyRetweeted, hasRetweeted, handleUndoRetweet, handleRetweet,isRetweeting,isUndoingRetweet } =
    useRetweet(tweetDetails?.id as string);
  console.log(alreadyRetweeted);

  const {
    handleLike,
    alreadyLiked,
    setHasLiked,
    hasLiked,
    handleUnlike,
    likeLoading,
    unlikeLoading,
  } = useLikeTweet(tweetDetails?.id as string);

  const { setModal: setLikesModal } = useLikesModal();
  const { setModal: setRetweetsModal } = useRetweetsModal();
  const { setModal: setReplyModal } = useReplyModal();
  const { setLikes } = useUserLikes();
  const { setRetweets } = useUserRetweets();
  const { setTweetId } = useTweetId();
  return (
    <Body>
      <Head>
        <title>{tweetDetails?.user.name} on Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavFeed title="Tweet" />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-2 p-4  md:space-y-4 ">
          {tweetDetails?.originalTweet !== null ? (
            <TweetComponent
              tweet={tweetDetails?.originalTweet as TweetWithUser}
            />
          ) : null}
          <div className="flex items-center gap-x-4 ">
            <Avatar
              image={tweetDetails?.user.image as string}
              width={40}
              height={40}
            />
            <Link
              href={`/${tweetDetails?.user.id}/${tweetDetails?.user.name}`}
              className="font-semibold hover:underline"
            >
              {tweetDetails?.user.name}
            </Link>
          </div>
          {tweetDetails?.originalTweet ? (
            <p className="text-gray-500">
              Replying to{" "}
              <span className="text-primary">
                {tweetDetails?.originalTweet?.user.name}
              </span>
            </p>
          ) : null}

          <p className="text-lg md:text-2xl">{tweetDetails?.text}</p>
          {tweetDetails?.image ? (
            <div className="relative  h-96 w-full md:w-3/4">
              {tweetDetails?.image.includes("video") ? (
                <video controls className="relative h-full w-full rounded-2xl">
                  <source src={tweetDetails?.image} type="video/mp4"></source>
                </video>
              ) : (
                <Image
                  objectFit="cover"
                  alt={tweetDetails?.text ?? ""}
                  src={tweetDetails?.image}
                  className="rounded-2xl"
                  layout="fill"
                />
              )}
            </div>
          ) : null}
          <div className="flex items-center gap-x-2 text-sm md:text-base ">
            <p className=" text-gray-500">
              {moment(tweetDetails?.createdAt).format("LT")}
            </p>
            <p className=" text-gray-500">
              {moment(tweetDetails?.createdAt).format("ll")}
            </p>
          </div>
          <div className="flex items-center gap-x-4 border-y border-base-200 px-2 py-4">
            <div
              onClick={() => {
                setRetweetsModal(true);
                setRetweets(
                  tweetDetails?.retweets as unknown as TweetWithUser[]
                );
              }}
              className="flex cursor-pointer items-center gap-x-2 text-gray-400"
            >
              <span className="flex items-center gap-x-2">
                <span className="text-xl font-semibold text-neutral">
                  {" "}
                  {tweetDetails?.retweets.length}
                </span>{" "}
                Retweets
              </span>
            </div>

            <div
              onClick={() => {
                setLikesModal(true);
                setLikes(tweetDetails?.likes as LikesWithPayloads[]);
              }}
              className="flex cursor-pointer items-center  gap-x-2 text-gray-400 "
            >
              <span className="flex items-center gap-x-2">
                <span className="text-xl font-semibold text-neutral">
                  {" "}
                  {tweetDetails?.likes.length}
                </span>{" "}
                Likes
              </span>
            </div>
          </div>
          <div className="flex items-center justify-evenly gap-x-4 border-b border-base-200  px-2 pb-4 text-xl text-gray-400">
            <AiOutlineComment
              className="cursor-pointer hover:text-primary  "
              onClick={() => {
                setTweetId(tweetDetails?.id as string);
                setReplyModal(true);
              }}
            />
            {(alreadyRetweeted !== null || hasRetweeted) &&
            status === "authenticated" ? (
              <button onClick={handleUndoRetweet} disabled={isUndoingRetweet || isRetweeting}>
                <AiOutlineRetweet className="cursor-pointer text-primary group-hover:text-primary" />
              </button>
            ) : (
              <button onClick={handleRetweet} disabled={isUndoingRetweet || isRetweeting}>
                <AiOutlineRetweet className="cursor-pointer group-hover:text-primary" />
              </button>
            )}
            {/* <AiOutlineRetweet className="cursor-pointer hover:text-primary " /> */}
            <div className="cursor-pointer">
              {(alreadyLiked !== null || hasLiked) &&
              status === "authenticated" ? (
                <button
                  onClick={handleUnlike}
                  disabled={likeLoading || unlikeLoading}
                >
                  <AiFillHeart className="text-primary" />
                </button>
              ) : (
                <button
                  onClick={handleLike}
                  disabled={unlikeLoading || likeLoading}
                >
                  <AiOutlineHeart className="group-hover:text-primary" />
                </button>
              )}
            </div>

            {/* <AiOutlineHeart className="cursor-pointer hover:text-primary " /> */}
          </div>
          <ReplyForm tweetId={tweetDetails?.id || ""} />
          <div>
            {replies?.map((reply) => (
              <TweetComponent tweet={reply as TweetWithUser} key={v4()} />
            ))}
          </div>
        </div>
      )}
    </Body>
  );
};

export default StatusPage;
