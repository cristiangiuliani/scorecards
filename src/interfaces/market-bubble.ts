export interface IMarketBubbleContext extends IMarketBubbleProvider  {
    updateMarketBubble: (newState: IMarketBubbleProvider) => void;
};

export interface IBubbleData {
  vixHistory?: number[];
  nvidiaPE?: number;
  nasdaqPE?: number;
  fearGreed?: number;
  rsiSP500?: number;
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface IBubbleDataStatus extends IBubbleData {
  isNvidiaPELoading?: boolean;
  isNasdaqPELoading?: boolean;
  isVixHistoryLoading?: boolean;
  isFearGreedLoading?: boolean;
  isRsiLoading?: boolean;
}

export interface IMarketBubbleProvider extends IBubbleDataStatus {
  isLoadingBubble?: boolean;
  refetchMarketBubbleData?: () => void;
}

export interface IBubbleIndicator {
  score: number;
  factors: {
    nvidiaOvervalued: boolean;
    nasdaqOvervalued: boolean;
    vixPersistent: boolean;
  };
}
