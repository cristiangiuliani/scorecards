export interface IMarketCryptoContext extends IMarketCryptoProvider  {
    updateMarketCrypto: (newState: IMarketCryptoProvider) => void;
};

export interface TCryptoData {
  btcFearGreed?: number;
  btcDominance?: number;
  currentPrice?: number;
  ath?: number;
  prices?: number[];
  volumes?: number[];
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface TCryptoDataStatus extends TCryptoData {
  isBtcLoading?: boolean;
  isBtcDominanceLoading?: boolean;
  isBtcRsiLoading?: boolean;
  isBtcFearGreedLoading?: boolean;
}

export interface IMarketCryptoProvider extends TCryptoDataStatus {
  isLoadingCrypto?: boolean;
  refetchMarketCryptoData?: () => void;
}
