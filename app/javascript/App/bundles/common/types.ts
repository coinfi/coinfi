export interface Coin {
  id: number,
  market_info: any,
  name: string,
  slug: string,
  symbol: string,
}

export type CoinList = Array<Coin>;

export interface User {
  created_at: string,
  email: string,
  id: number,
  provider: any,
  role: string,
  token_sale: any,
  uid: string,
  updated_at: string,
  username: string,
};

export interface WindowScreenType extends Window {
  isMobile?: boolean,
  isTablet?: boolean,
};
