import Link from "next/link";

import { Newspaper } from "lucide-react";

import { newsAPI } from "@/api";
import { Aspect } from "@/components/aspect";

export const runtime = "edge";

export default async function Page() {
  return (
    <>
      <header className="p-6 col-start-2 w-full flex flex-col items-center animate-fade-in-bottom">
        <a href="/">
          <h1 className="flex items-center font-bold text-lg">
            <Newspaper className="w-6 h-6 mr-2" />
            Journal
          </h1>
        </a>
        <span className="w-full text-center text-xs mt-2 text-gray-400">
          Discover, Engage, Evolve: Unveiling the Essence of Reading
        </span>
      </header>
      <main className="flex-1 grid grid-cols-[minmax(1rem,1fr)_minmax(auto,120ch)_minmax(1rem,1fr)]">
        <div className="col-start-2 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2 content-start">
          <PageOfArticles page={1} />
        </div>
      </main>
    </>
  );
}

async function PageOfArticles({ page }: { page: number }) {
  const articles = await newsAPI.list(page);

  return (
    <>
      {articles.map((article, index) => (
        <Link key={article.id} href={`/articles/${article.id}`}>
          <Aspect ratio={2 / 1}>
            <article
              className={
                "opacity-0 animate-fade-in-bottom rounded-md overflow-hidden group w-full h-full"
              }
              style={{ animationDelay: `${Math.ceil(index / 4) * 100}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  article.thumbnail +
                  "?x-oss-process=image/resize,w_100/quality,q_80"
                }
                data-src={article.thumbnail}
                alt=""
                className="lazyload blur-up group-hover:scale-105 object-cover w-full h-full"
              />
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-opacity-40 bg-black group-hover:bg-opacity-5 duration-300" />
            </article>
          </Aspect>
        </Link>
      ))}
    </>
  );
}
