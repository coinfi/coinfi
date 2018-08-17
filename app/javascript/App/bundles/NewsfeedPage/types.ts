interface CoinLinkData {
  id: number,
  symbol: string,
  slug: string,
};

interface Category {
  name: string,
};

export interface NewsItem {
  id: number,
  title: string
  summary: string
  content: string
  url: string
  feed_item_published_at: string,
  categories: Array<Category>,
  coin_link_data: Array<CoinLinkData>,
};

export type ContentType = "none" | "coin" | "news";
