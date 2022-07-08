// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import SmartContract from "../../contracts/Auction.json";
import AkachiNFT from "../../contracts/AkachiNFT.json"
// log
import { fetchData } from "../data/dataActions";
require('dotenv').config()
const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

// const updateAccountRequest = (payload) => {
//   return {
//     type: "UPDATE_ACCOUNT",
//     payload: payload,
//   };
// };

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        console.log("networkId: ", networkId);
        // const NetworkData = await SmartContract.networks[networkId];
        if (networkId === "4") { // IMPORTANT. ONCE YOUR CONTRACT IS ON THE MAIN NET, SWITCH THIS NUMBER TO 1.
          const SmartContractObj = new Web3EthContract(
            SmartContract,
            process.env.REACT_APP_AUCTION_NFT_CONTRACT // **IMPORTANT** PASTE CONTRACT ADDRESS HERE
          );
          console.log("Akachi", process.env.REACT_APP_AKACHI_NFT_CONTRACT)
          const AkachiNFTObj = new Web3EthContract(
            AkachiNFT,
            process.env.REACT_APP_AKACHI_NFT_CONTRACT
          )
          console.log("Akach", AkachiNFTObj)
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              akachiNFT: AkachiNFTObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Ethereum."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Please install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    //dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
