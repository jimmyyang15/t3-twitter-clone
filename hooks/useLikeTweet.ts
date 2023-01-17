import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TweetWithUser } from "../interface";
import { useLoginModal } from "../lib/zustand";
const useLikeTweet = (tweetId: string) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();
  const { mutateAsync: likeTweet,isLoading:likeLoading } = trpc.like.likeTweet.useMutation({
    onMutate: () => {
      utils.tweet.getTweets.cancel();
      const optimisticUpdate = utils.tweet.getTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      // if(router.pathname==="/search") {
      //   utils.tweet.searchTweets.invalidate();

      // }
      // utils.tweet.getTweets.invalidate();
      // utils.tweet.getInfiniteTweets.invalidate();
      // if(router.pathname==="/status/[statusId]") {
      //   utils.tweet.getSingleTweet.invalidate();

      // }
      // if(router.pathname==="/[userId]/[username]") {
      //   utils.tweet.getUserTweets.invalidate();
      // }

      utils.tweet.getSingleTweet.invalidate({
        tweetId
      })
    },
  });
  const { mutateAsync: unlikeTweet,isLoading:unlikeLoading } = trpc.like.unlikeTweet.useMutation({
    onMutate: () => {
      utils.tweet.getTweets.cancel();
      const optimisticUpdate = utils.tweet.getTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      // if(router.pathname==="/search") {
      //   utils.tweet.searchTweets.invalidate();

      // }
      // utils.tweet.getTweets.invalidate();
      // utils.tweet.getInfiniteTweets.invalidate();
      // if(router.pathname==="/status/[statusId]") {
      //   utils.tweet.getSingleTweet.invalidate();

      // }
      // if(router.pathname==="/[userId]/[username]") {
      //   utils.tweet.getUserTweets.invalidate();
      // }
      utils.tweet.getSingleTweet.invalidate({
        tweetId
      })

    },
  });
  const [hasLiked, setHasLiked] = useState(false);

  const { setModal: setLoginModal } = useLoginModal();

  const { data: alreadyLiked } = trpc.like.userLikeTweet.useQuery({
    tweetId,
  });

  const handleLike = async() => {
    setHasLiked(true)

    if (status === "authenticated") {
      await toast.promise(
        likeTweet({ tweetId: tweetId as string }),
        {
          success: "Tweet liked",
          loading: "Liking tweet",
          error: (err) => "Oops something went wrong " + err,
        }
      );
    } else {
      setLoginModal(true);
    }
  };
  const handleUnlike = async() => {
    setHasLiked(false)

    if (status === "authenticated") {
      await toast.promise(unlikeTweet({ tweetId: tweetId as string}),
      {
        success: "Tweet unliked",
        loading: "Unliking tweet",
        error: (err) => "Oops something went wrong " + err,
      });
     
    } else {
      setLoginModal(true);
    }
  };


  return { handleLike, hasLiked,handleUnlike, setHasLiked, alreadyLiked,likeLoading,unlikeLoading };
};

export default useLikeTweet;
