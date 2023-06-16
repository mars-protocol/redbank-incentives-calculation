import { CosmWasmClient } from "./dependencies.ts";
import { RPC_URL, CONTRACT_ADDRESS } from "./constants.ts";

const client = await CosmWasmClient.connect(RPC_URL);

/** Returns Redbank Market info for given `denom` from Redbank */
export const getMarketInfo = async (denom: string) =>
  await client.queryContractSmart(CONTRACT_ADDRESS.redbank, {
    market: { denom },
  });

/** Returns given `denom`'s Market liquidity amount from Redbank */
export const getMarketLiquidityAmount = async (
  denom: string,
  amount_scaled: string
) =>
  await client.queryContractSmart(CONTRACT_ADDRESS.redbank, {
    underlying_liquidity_amount: {
      denom,
      amount_scaled,
    },
  });

/** Returns Asset Incentives info for given `denom` from the Incentives contract */
export const getAssetIncentiveInfo = async (denom: string) =>
  await client.queryContractSmart(CONTRACT_ADDRESS.incentives, {
    asset_incentive: { denom },
  });
