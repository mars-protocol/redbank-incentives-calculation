import { BigNumber } from "./dependencies.ts";
import { SECONDS_IN_A_YEAR } from "./constants.ts";
import {
  getMarketInfo,
  getAssetIncentiveInfo,
  getMarketLiquidityAmount,
} from "./functions.ts";

// Asset denom to query incentives for
const DENOM = "uosmo";

// First step is to get Market info
const marketInfo = await getMarketInfo(DENOM);

// Secondly, getting market's liquidity amount and incentive info
const [marketLiquidityAmount, assetIncentiveInfo] = await Promise.all([
  getMarketLiquidityAmount(DENOM, marketInfo.collateral_total_scaled),
  getAssetIncentiveInfo(DENOM),
]);

// Then calculating the asset's deposit APR = Redbank.Market(denom).liquidity_rate * 100
const depositApr = new BigNumber(marketInfo.liquidity_rate).multipliedBy(100);

// Next is to calculate annual emission by multiplying emission_per_second with seconds in a year
const annualEmission = new BigNumber(
  assetIncentiveInfo.emission_per_second
).multipliedBy(SECONDS_IN_A_YEAR);

// Lastly, dividing annualEmission by market's underlying liquidity amount,
// then multiplying by 100 to get the annual incentive percent
const incentiveApy = new BigNumber(annualEmission)
  .dividedBy(marketLiquidityAmount)
  .multipliedBy(100);

console.log(`Denom: ${DENOM}
Deposit APR: %${depositApr.toFixed(2)}
Incentive APY: %${incentiveApy.toFixed(2)}
`);
