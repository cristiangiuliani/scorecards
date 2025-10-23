export interface IMarketCryptoContext extends IMarketCryptoProvider  {
    updateMarketCrypto: (newState: IMarketCryptoProvider) => void;
};

export interface ICryptoData {
  btcFearGreed?: number;
  btcDominance?: number;
  currentPrice?: number;
  ath?: number;
  prices?: number[];
  volumes?: number[];
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface ICryptoDataStatus extends ICryptoData {
  isBtcLoading?: boolean;
  isBtcDominanceLoading?: boolean;
  isBtcRsiLoading?: boolean;
  isBtcFearGreedLoading?: boolean;
}

export interface IMarketCryptoProvider extends ICryptoDataStatus {
  isLoadingCrypto?: boolean;
  refetchMarketCryptoData?: () => void;
}
