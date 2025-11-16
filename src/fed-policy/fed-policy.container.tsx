import React, {
  useContext, useEffect,
} from 'react';

import { API } from '../constants/api';
import type {
  IFREDResponse,
} from '../interfaces/api-responses';
import type { IFedPolicyContext } from '../interfaces/fed-policy';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import FedPolicyComponent from './fed-policy.component';
import FedPolicyContext from './fed-policy.context';

const FedPolicyContainer: React.FC = () => {
  const {
    updateFedPolicy = () => {},
  } = useContext<IFedPolicyContext>(FedPolicyContext);

  // Fetch CPI Inflation
  const cpiData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredCPI,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const {
      data, loading, cacheExpiresAt, cacheCreatedAt,
    } = cpiData;
    updateFedPolicy({
      isCpiLoading: loading,
      cacheExpiresAt,
      cacheCreatedAt,
    });

    if (data?.observations && data.observations.length >= 13) {
      const latest = parseFloat(data.observations[0].value);
      const yearAgo = parseFloat(data.observations[12].value);
      const yoyChange = ((latest - yearAgo) / yearAgo) * 100;
      updateFedPolicy({
        cpiInflation: parseFloat(yoyChange.toFixed(2)),
      });
    }
  }, [cpiData.data, cpiData.cacheExpiresAt, cpiData.cacheCreatedAt]);

  // Fetch Core PCE
  const pceData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredPCE,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = pceData;
    updateFedPolicy({ isCorePceLoading: loading });

    if (data?.observations && data.observations.length >= 13) {
      const latest = parseFloat(data.observations[0].value);
      const yearAgo = parseFloat(data.observations[12].value);
      const yoyChange = ((latest - yearAgo) / yearAgo) * 100;
      updateFedPolicy({
        corePce: parseFloat(yoyChange.toFixed(2)),
      });
    }
  }, [pceData.data]);

  // Fetch Unemployment Rate
  const unemploymentData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredUnemployment,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = unemploymentData;
    updateFedPolicy({ isUnemploymentLoading: loading });

    if (data?.observations && data.observations.length > 0) {
      updateFedPolicy({
        unemploymentRate: parseFloat(data.observations[0].value),
      });
    }
  }, [unemploymentData.data]);

  // Fetch Wages (Average Hourly Earnings)
  const wagesData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredWages,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = wagesData;
    updateFedPolicy({ isEarningsLoading: loading });

    if (data?.observations && data.observations.length >= 13) {
      const latest = parseFloat(data.observations[0].value);
      const yearAgo = parseFloat(data.observations[12].value);
      const yoyChange = ((latest - yearAgo) / yearAgo) * 100;
      updateFedPolicy({
        averageHourlyEarnings: parseFloat(yoyChange.toFixed(2)),
      });
    }
  }, [wagesData.data]);

  // Fetch Federal Funds Rate
  const fedFundsData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredFedFunds,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = fedFundsData;
    updateFedPolicy({ isFedFundsLoading: loading });

    if (data?.observations && data.observations.length > 0) {
      updateFedPolicy({
        federalFundsRate: parseFloat(data.observations[0].value),
      });
    }
  }, [fedFundsData.data]);

  useEffect(() => {
    updateFedPolicy({
      refetchFedPolicyData: () => {
        cpiData.forceRefresh();
        pceData.forceRefresh();
        unemploymentData.forceRefresh();
        wagesData.forceRefresh();
        fedFundsData.forceRefresh();
      },
    });
  }, []);

  return (
    <FedPolicyComponent />
  );
};

export default FedPolicyContainer;
