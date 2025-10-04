export type IMarketCryptoContext = IMarketCryptoProvider  & {
    updateMarketCrypto: (newState: IMarketCryptoProvider) => void;
};

export type TCryptoData = {
  btcFearGreed?: number;
  btcDominance?: number;
  currentPrice?: number;
  ath?: number;
  prices?: number[];
  volumes?: number[];
  lastUpdated?: string;
}

export type IMarketCryptoProvider = TCryptoData &{
  isLoadingCrypto?: boolean;
  refetchMarketCryptoData?: () => void;
}
