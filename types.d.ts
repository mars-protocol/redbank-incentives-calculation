interface PoolParams {
  swap_fee: string;
}

interface PoolToken {
  denom: string;
  amount: string;
}

interface PoolAsset {
  token: PoolToken;
  weight: string;
}

interface Pool {
  pool_params: PoolParams;
  pool_assets: PoolAsset[];
}

interface PoolResponse {
  pool: Pool;
}

interface Asset {
  denom: string;
  decimals: number;
}
