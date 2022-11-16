import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import CreateTweet from "../components/CreateTweet";
import TweetComponent from "../components/TweetComponent";
import { ITweet } from "../../interface";
import { v4 } from "uuid";
import Body from "../components/Body";
import { Ring } from "@uiball/loaders";
import Loader from "../components/Loader";

const Home: NextPage = () => {
  const { data: tweets, isLoading } = trpc.tweet.getTweets.useQuery();
  console.log(tweets);

  const { data } = useSession();
  console.log(data);

  return (
    <>
      <Head>
        <title>Home / Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <h1 className="text-xl font-semibold">Home</h1>
        <CreateTweet />
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {tweets?.map((tweet) => (
              <TweetComponent tweet={tweet} key={v4()} />
            ))}
          </>
        )}
      </Body>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
