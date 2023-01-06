import Head from "next/head";
import React from "react";
import { v4 } from "uuid";
import useBookmark from "../../hooks/useBookmark";
import Body from "../components/Body";
import NavFeed from "../components/NavFeed";
import TweetComponent from "../components/TweetComponent";

const BookmarkPage = () => {
  const { bookmarks } = useBookmark();
  return (
    <Body>
      <Head>
        <title>Bookmarks / Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavFeed title="Bookmarks" />
      {bookmarks?.map((bookmark) => (
        <TweetComponent key={v4()} tweet={bookmark.tweet} />
      ))}
    </Body>
  );
};

export default BookmarkPage;
