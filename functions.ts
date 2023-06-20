import { BigNumber, CosmWasmClient } from "./dependencies.ts";
import {
  ASSET,
  RPC_URL,
  CONTRACT_ADDRESS,
  MARS_OSMO_POOL_URL,
} from "./constants.ts";

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
  new BigNumber(
    await client.queryContractSmart(CONTRACT_ADDRESS.redbank, {
      underlying_liquidity_amount: {
        denom,
        amount_scaled,
      },
    })
  );

/** Returns Asset Incentives info for given `denom` from the Incentives contract */
export const getAssetIncentiveInfo = async (denom: string) =>
  await client.queryContractSmart(CONTRACT_ADDRESS.incentives, {
    asset_incentive: { denom },
  });

/** Returns given `denom`'s price in USD */
export const getPrice = async (asset: Asset): Promise<BigNumber> => {
  if (asset.denom === ASSET.MARS.denom) {
    return await getMarsPrice();
  }

  const price = (
    await client.queryContractSmart(CONTRACT_ADDRESS.oracle, {
      price: { denom: asset.denom },
    })
  ).price;

  // USD prices in 6 decimals
  const decimalDiff = 6 - asset.decimals;

  return new BigNumber(price).shiftedBy(-decimalDiff);
};

/** Returns MARS/OSMO spot price rate */
export const getMarsPrice = async () => {
  const resp = (await fetch(MARS_OSMO_POOL_URL).then((res) =>
    res.json()
  )) as PoolResponse;

  const spotPrice = calculateSpotPrice(resp.pool);
  const marsOsmoRate = new BigNumber(1).dividedBy(spotPrice);
  const osmoPrice = await getPrice(ASSET.OSMO);

  return marsOsmoRate.multipliedBy(osmoPrice);
};

const calculateSpotPrice = (pool: Pool) => {
  const swapFee = pool.pool_params.swap_fee;
  const assetIn = findAssetByTokenDenom(
    pool.pool_assets,
    ASSET.MARS.denom
  ) as PoolAsset;
  const assetOut = findAssetByTokenDenom(
    pool.pool_assets,
    ASSET.OSMO.denom
  ) as PoolAsset;

  const numerator = new BigNumber(assetIn.token.amount).div(assetIn.weight);
  const denominator = new BigNumber(assetOut.token.amount).div(assetOut.weight);

  const ratio = numerator.dividedBy(denominator);
  const scale = new BigNumber(1).dividedBy(new BigNumber(1).minus(swapFee));

  return ratio.multipliedBy(scale);
};

const findAssetByTokenDenom = (assets: PoolAsset[], denom: string) =>
  assets.find((a) => a.token.denom === denom);
