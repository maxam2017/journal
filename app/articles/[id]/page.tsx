import { Metadata } from "next";
import { notFound } from "next/navigation";

import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { ChevronLeft } from "lucide-react";

import { newsAPI } from "@/api";
import BackLink from "@/components/back-button";
import { cn } from "@/utils/cn";
import readTime from "@/utils/read-time";

export const runtime = "edge";

dayjs.extend(relative);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const article = await newsAPI.get(params.id);

    if (article) {
      const firstThumbnail = article.thumbnails[0];

      return {
        title: article.title,
        description: article.summary,
        ...(firstThumbnail && {
          image: new URL(firstThumbnail, process.env.CF_PAGES_URL!).toString(),
        }),
      };
    }
  } catch {
  } finally {
    return {};
  }
}

export default async function Article({ params }: { params: { id: string } }) {
  const article = await newsAPI.get(params.id);

  if (!article) {
    notFound();
  }

  return (
    <>
      <header className="mt-10 md:px-6 col-start-2 w-full flex justify-center animate-fade-in-bottom items-center">
        <BackLink
          href="/"
          className={cn(
            "flex items-center text-sm font-medium px-3 lg:py-2 rounded-full",
            "md:absolute md:left-5 lg:opacity-0 lg:animate-fade-in-right lg:hover:bg-slate-100 lg:hover:translate-x-10 lg:transition-[transform_color]",
          )}
          style={{ animationDelay: "600ms" }}
        >
          <ChevronLeft className="w-5 h-5 mr-1 flex-shrink-0" />
          <span className="hidden lg:inline">Back to Journal</span>
        </BackLink>
        <h1 className="flex items-center font-bold text-lg">{article.title}</h1>
      </header>
      <div className="flex items-center justify-center text-xs py-3 text-gray-500 animate-fade-in-bottom">
        <time
          dateTime={article.publishedAt}
          title={dayjs(article.publishedAt).format("MMMM DD, YYYY HH:mmA")}
        >
          {dayjs(article.publishedAt).fromNow()}
        </time>
        <span className="mx-2">•</span>
        <span>{readTime(article.length)} min read</span>
      </div>
      <main
        className="grid grid-cols-[minmax(1.2rem,1fr)_minmax(auto,85ch)_minmax(1.2rem,1fr)] opacity-0 animate-fade-in-bottom mb-8"
        style={{ animationDelay: "300ms" }}
      >
        {article.paragraphs.map((paragraph, index) => {
          if (paragraph.type === "text") {
            return (
              <p key={index} className="text-md text-gray-700 my-4 col-start-2">
                {paragraph.value}
              </p>
            );
          }

          if (paragraph.type === "image") {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={paragraph.value}
                className="lazyload blur-up md:rounded-md mx-auto mt-2 mb-6 w-full md:max-w-[70vw] col-start-1 col-end-4"
                alt=""
              />
            );
          }
        })}
      </main>
    </>
  );
}
