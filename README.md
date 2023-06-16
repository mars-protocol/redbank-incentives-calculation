# Mars Redbank Incentives APY Calculation

This Deno program queries MARS Redbank and Incentives contracts to calculate incentives yield percentage for the given asset denom.

Note that passed denom should already be enabled in the contracts in order to program to be complete.

## Getting started

In default, program works with `osmo-test-5` network contracts. Network and contracts can be changed by updating `RPC_URL` and `CONTRACT_ADDRESS` in the `constants.ts`.

Also, asset denom set to `uosmo` which can be altered in the `main.ts` file.

1. Install Deno: https://deno.com/manual@v1.20.1/getting_started/installation

   ```
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. Run the program
   ```
   deno run --allow-read --allow-net main.ts
   ```

### Results

```
Denom: uosmo
Deposit APR: %1.72
Incentive APY: %35.41
```
