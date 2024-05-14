export interface Article {
  id: string;
  title: string;
  thumbnail: string;
  length: number;
  publishedAt: string;
}

export interface FullArticle {
  id: string;
  title: string;
  publishedAt: string;
  thumbnails: string[];
  length: number;
  summary: string;
  paragraphs: { type: "image" | "text"; value: string }[];
  author: { name: string; avatar: string };
}
