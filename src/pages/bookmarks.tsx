import Head from "next/head";
import Image from "next/legacy/image";
import React, { useEffect } from "react";
import { v4 } from "uuid";
import useBookmark from "../../hooks/useBookmark";
import { TweetWithUser } from "../../interface";
import { useDebouncedBookmarks } from "../../lib/zustand";
import Body from "../components/Body";
import BookmarkNav from "../components/BookmarkNav";
import Loader from "../components/Loader";
import NavFeed from "../components/NavFeed";
import TweetComponent from "../components/TweetComponent";
import TweetList from "../components/TweetList";
import { trpc } from "../utils/trpc";
const BookmarkPage = () => {
  const { bookmarks: data, isLoading } = useBookmark();
  const utils = trpc.useContext()

  const bookmarks = data?.map((bookmark) => bookmark.tweet);
  const { bookmark: bookmarkValue } = useDebouncedBookmarks();

  const { data: searchBookmarks, isLoading: searchLoading } =
    trpc.bookmark.searchUserBookmarks.useQuery({
      term: bookmarkValue,
    });

  const debouncedBookmarks = searchBookmarks?.map((bookmark) => bookmark.tweet);

  return (
    <Body>
      <Head>
        <title>Bookmarks / Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BookmarkNav />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {bookmarks?.length !== 0 ? (
            <>
              {bookmarkValue === "" ? (
                <TweetList tweets={bookmarks as TweetWithUser[]} />
              ) : (
                <>
                  {searchLoading ? (
                    <Loader />
                  ) : (
                    <TweetList tweets={debouncedBookmarks as TweetWithUser[]} />
                  )}
                </>
              )}
            </>
          ) : (
            <div className="items-centers flex flex-col justify-center gap-y-4 text-center ">
              <div className="relative mx-auto h-44 w-1/2">
                <Image
                  alt="no bookmarks"
                  layout="fill"
                  objectFit="cover"
                  src="/no-bookmarks.png"
                />
              </div>
              <h1 className="text-4xl font-bold text-neutral">
                Save tweets for later
              </h1>
              <p className="mx-auto w-1/2 text-start text-gray-500">
                Don’t let the good ones fly away! Bookmark Tweets to easily find
                them again in the future.
              </p>
            </div>
          )}
        </>
      )}

      {/* {bookmarks?.map((bookmark) => (
        <TweetComponent key={v4()} tweet={bookmark.tweet as TweetWithUser} />
      ))} */}
    </Body>
  );
};

export default BookmarkPage;
