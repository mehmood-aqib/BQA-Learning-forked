let axios = require("axios");
const BigNumber = require("bignumber.js");
const Web3 = require("web3");
const web3 = new Web3(
  "https://rinkeby.infura.io/v3/0b40e4fd2cca41138c8ebbc5ee029842"
);
const PK = "859e925c4a8173a9ffea74ad1d93fc8b2392f7175be6ec8b9140af61d9d1f16c";

async function getStakeUnstakingHistory(address, network) {
  let url = `https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-mumbai`;
  let result = await axios({
    url: url,
    method: "post",
    data: {
      query: `{
            stakeTransactions(where:{ staker: "${address}"} orderBy: timestamp){
              amount
              cycleId
              type
            }
          }
          `,
    },
  });

  let stakeCyclesArr = [];
  let stakeArr = [];

  let unStakeCyclesArr = [];
  let unStakeArr = [];

  result?.data?.data?.stakeTransactions?.forEach((e) => {
    if (e.type == "stake") {
      stakeCyclesArr.push(parseInt(e.cycleId));
      stakeArr.push(parseInt(e.amount));
    } else if (e.type == "withdraw") {
      unStakeCyclesArr.push(parseInt(e.cycleId));
      unStakeArr.push(parseInt(e.amount));
    }
  });
  return { stakeCyclesArr, stakeArr, unStakeCyclesArr, unStakeArr };
}

async function getLastCycleIdClaimedandStakeBalance(address, network) {
  let url = `https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-mumbai`;
  let result = await axios({
    url: url,
    method: "post",
    data: {
      query: `{
        stakers(where:{id:"${address}"}){
          lastCycleIdClaimed
          stakedAmountOnLastCycleIdClaimed
        }
      }      
    `,
    },
  });

  return {
    lastCycleIdClaimed: result?.data?.data?.stakers[0]?.lastCycleIdClaimed,
    stakeBalance: parseInt(
      result?.data?.data?.stakers[0]?.stakedAmountOnLastCycleIdClaimed
    ),
  };
}

async function getCycles(network) {
  let url = `https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-${network}`;
  let result = await axios({
    url: url,
    method: "post",
    data: {
      query: `{
        cycles(first: 1000 orderBy: timestamp ) {
          id
          cummulativeStaked
          presaleTokens
          presaleAmounts
          timestamp
        }
      }
            
        `,
    },
  });

  let cycleIds = [];
  let cycleDetails = [];

  result?.data?.data?.cycles?.forEach((e) => {
    cycleIds.push(parseInt(e.id));
    cycleDetails.push(e);
  });

  return {
    cycleIds,
    cycleDetails,
  };
}

function getCurrentCycle() {
  const cycleDuration = 900;
  const totalTime = Date.now() / 1000 - 1654805147;
  const currentCycleId = Math.floor(parseInt(totalTime / cycleDuration));
  return currentCycleId;
}

async function getRewardOfAddress(address, network) {
  let { stakeCyclesArr, stakeArr, unStakeCyclesArr, unStakeArr } =
    await getStakeUnstakingHistory(address, network);
  // console.log(stakeCyclesArr, stakeArr, unStakeCyclesArr, unStakeArr);
  let { lastCycleIdClaimed, stakeBalance } =
    await getLastCycleIdClaimedandStakeBalance(address, network);
  // console.log(lastCycleIdClaimed, stakeBalance);
  let { cycleIds, cycleDetails } = await getCycles(network);
  // console.log(cycleIds, cycleDetails);
  let currentCycle = getCurrentCycle();
  //   console.log(currentCycle);

  let index1, index2, index3;
  let cummulativeStake, rewardShare, tempAmount;
  let rewardTokensAddresses = [];
  let rewardTokenAmounts = [];

  if (lastCycleIdClaimed == 0) {
    return;
  }

  for (let i = lastCycleIdClaimed; i <= currentCycle; i++) {
    index1 = stakeCyclesArr.indexOf(i - 1);
    if (index1 > -1) {
      stakeBalance += stakeArr[index1];
    }

    index2 = unStakeCyclesArr.indexOf(i);
    if (index2 > -1) {
      stakeBalance -= unStakeArr[index2];
    }

    index3 = cycleIds.indexOf(i);
    if (index3 > -1) {
      if (cycleDetails[index3]?.presaleTokens?.length > 0) {
        cummulativeStake = parseInt(cycleDetails[index3]?.cummulativeStaked);
        if (cummulativeStake >= stakeBalance) {
          rewardShare = stakeBalance / cummulativeStake;
          if (rewardShare > 0) {
            cycleDetails[index3]?.presaleTokens?.forEach((e, index) => {
              tempAmount = Math.floor(
                parseInt(
                  web3.utils.toWei(cycleDetails[index3]?.presaleAmounts[index])
                ) * rewardShare
              ).toString();
              if (tempAmount > 0) {
                rewardTokensAddresses.push(e);
                rewardTokenAmounts.push(tempAmount);
              }
            });
          }
        }
      }
    }
  }
  console.log(rewardTokensAddresses, rewardTokenAmounts);

  let message = address;

  for (let i = 0; i < rewardTokensAddresses.length; i++) {
    message = message.concat(
      new BigNumber(rewardTokenAmounts[i]).toString(16).padStart(64, "0")
    );
    message = message.concat(rewardTokensAddresses[i].slice(2, 42));
  }

  let messageHash = web3.utils.keccak256(message);
  let signature = web3.eth.accounts.sign(messageHash, PK)?.signature;
  console.log(signature);

  return {
    rewardTokensAddresses,
    rewardTokenAmounts,
    signature,
  };
}

getRewardOfAddress(
  "0xD468E784F2e7904D360759A292b2712172bDFCD3".toLowerCase(),
  "rinkeby"
);
