import { BigNumber } from "./dependencies.ts";
import { SECONDS_IN_A_YEAR, ASSET } from "./constants.ts";
import {
  getMarketInfo,
  getMarsPrice,
  getAssetIncentiveInfo,
  getMarketLiquidityAmount,
  getPrice,
} from "./functions.ts";

// Depositing asset to query APY for
const DEPOSITING_ASSET: Asset = ASSET.OSMO;

// First step is to get Market info
const marketInfo = await getMarketInfo(DEPOSITING_ASSET.denom);

if (!marketInfo) {
  throw "There is no market for the given denom.";
}

// Secondly, getting market's liquidity amount, incentive info and price infos of MARS token and depositing asset
const [
  marketLiquidityAmount,
  assetIncentiveInfo,
  depositingAssetPrice,
  marsPrice,
] = await Promise.all([
  getMarketLiquidityAmount(
    DEPOSITING_ASSET.denom,
    marketInfo.collateral_total_scaled
  ),
  getAssetIncentiveInfo(DEPOSITING_ASSET.denom),
  getPrice(DEPOSITING_ASSET),
  getMarsPrice(),
]);

// Next is to calculate annual emission by multiplying emission_per_second with seconds in a year,
// shifting the value by the MARS decimals to get the actual amount
// And then multiplying by the MARS price to get the dollar value of annual emission
const annualEmissionValue = new BigNumber(
  assetIncentiveInfo.emission_per_second
)
  .multipliedBy(SECONDS_IN_A_YEAR)
  .shiftedBy(-ASSET.MARS.decimals)
  .multipliedBy(marsPrice);

// Also, converting the market liquidity amount to dollar value
const marketLiquidityValue = depositingAssetPrice.multipliedBy(
  marketLiquidityAmount.shiftedBy(-DEPOSITING_ASSET.decimals)
);

// Calculating market returns
const marketReturns = marketLiquidityValue.multipliedBy(
  marketInfo.liquidity_rate
);

// Adding annualEmission to market returns and then dividing by market's underlying liquidity value.
// Lastly, multiplying by 100 to get the total annual return percent
const apy = new BigNumber(annualEmissionValue)
  .plus(marketReturns)
  .dividedBy(marketLiquidityValue)
  .multipliedBy(100);

console.log(`Denom: ${DEPOSITING_ASSET.denom}
Incentive APY: %${apy.toFixed(2)}
`);
