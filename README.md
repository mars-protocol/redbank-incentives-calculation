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

## Calculation

Depositing into a OSMO market that has:

- base liquidity rate of 10% (what borrowers are paying depositors)
- incentive scheme setup where MARS is issued at 100000 umars per second
- total liquidity in pool of 2,000,000 OSMO

_Step 1:_
Calculate the normal returns on osmo = 2m OSMO \* 0.1 = 200k OSMO

_Step 2:_
Calculate the incentive returns in MARS = (31,540,000 seconds \* 100000 umars) / 1e6 = 3,154,000 MARS a year

_Step 3:_
Convert incentives rewards to base asset = MARS/OSMO rate currently is ~ 0.13. 3,154,000 MARS \* 0.13 = 410,020 OSMO

_Step 4:_
Determine return

200K OSMO + 410.02K OSMO = 610.02K OSMO

610,020 / 2,000,000 \* 100 = 30.501% APY
