import { xml2js } from "xml-js";

import { Article, FullArticle } from "./types";

class NewsAPI {
  origin = process.env.NEWS_API_ORIGIN!;

  private toMediaURL = (path: any) => {
    try {
      const url = new URL(path);
      if (!url) return path;

      return `/media${url.pathname}`;
    } catch {
      return path;
    }
  };

  private toArticle = (object: any): Article => {
    return {
      id: object.id,
      title: object.title_en,
      thumbnail: this.toMediaURL(object.thumbnail_url),
      length: object.length,
      publishedAt: object.published_at,
    };
  };

  private toFullArticle = (object: any): FullArticle => {
    let paragraphs = [];
    try {
      const json = xml2js(object.content, {
        compact: true,
        ignoreAttributes: true,
      }) as any;
      paragraphs = json["article_content"].para.map((paragraph: any) => {
        if (paragraph.img)
          return {
            type: "image",
            value: this.toMediaURL(paragraph.img.url._text),
          };
        if (paragraph.sent)
          return {
            type: "text",
            value: Array.isArray(paragraph.sent)
              ? paragraph.sent.map((value: any) => value["_cdata"]).join(" ")
              : paragraph.sent["_cdata"],
          };
        return paragraph;
      });
    } catch {}

    return {
      id: object.id,
      title: object.title_en,
      publishedAt: object.published_at,
      thumbnails: (object.thumbnail_urls || []).map(this.toMediaURL),
      length: object.length,
      summary: object.summary,
      paragraphs,
      author: {
        name: object.source.name_en,
        avatar: this.toMediaURL(object.source.logo_url),
      },
    };
  };

  async list(page?: number): Promise<Article[]> {
    const searchParams = new URLSearchParams();
    searchParams.set("ipp", "24");
    if (page) searchParams.set("page", page.toString());

    const res = await fetch(
      new URL(
        `/news/retrieve/articles?${searchParams}`,
        process.env.NEWS_API_ORIGIN!,
      ),
      {
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      },
    );
    if (res.ok) {
      const json: any = await res.json();
      return json.objects.map(this.toArticle);
    }

    return [];
  }

  async get(id: string): Promise<FullArticle | null> {
    const res = await fetch(
      new URL(`/news/articles/${id}`, process.env.NEWS_API_ORIGIN!),
      {
        next: {
          revalidate: 24 * 60 * 60, // 24 hours
        },
      },
    );

    if (res.ok) {
      const json: any = await res.json();

      return this.toFullArticle(json);
    }

    return null;
  }
}

const newsAPI = new NewsAPI();

export { newsAPI };
