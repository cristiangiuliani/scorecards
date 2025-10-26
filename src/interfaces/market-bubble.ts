export interface IMarketBubbleContext extends IMarketBubbleProvider  {
    updateMarketBubble: (newState: IMarketBubbleProvider) => void;
};

export interface IBubbleData {
  vixHistory?: number[];
  nvidiaPE?: number;
  nasdaqPE?: number;
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface IBubbleDataStatus extends IBubbleData {
  isNvidiaPELoading?: boolean;
  isNasdaqPELoading?: boolean;
  isVixHistoryLoading?: boolean;
}

export interface IMarketBubbleProvider extends IBubbleDataStatus {
  isLoadingBubble?: boolean;
  refetchMarketBubbleData?: () => void;
}

export interface IBubbleIndicator {
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number; // 0-3
  factors: {
    nvidiaOvervalued: boolean;
    nasdaqOvervalued: boolean;
    vixPersistent: boolean;
  };
}
