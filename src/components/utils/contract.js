import abi from "./contract.json";
import contractBytecode from "./bytecode.json";
import { ContractFactory, Contract } from "@ethersproject/contracts";
import { AlchemyProvider, JsonRpcProvider } from "@ethersproject/providers";
// import { Wallet } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connector";

// const MINTER_KEY =
//   "0x88198d1f373d29bc4b6a1ec1bc3b8f01eace724c62c67836570c3e5fa54e4b85";
// const provider = new JsonRpcProvider("http://127.0.0.1:8545");
// const wallet = new Wallet(MINTER_KEY, provider);

const provider = new AlchemyProvider(80001, "uf9otxd_A3ObMBwC4grerADZKGDxHBlJ");

export const useContract = () => {
  const { activate, account, library } = useWeb3React();

  const connectWallet = async () => {
    try {
      activate(injected);
    } catch (error) {
      console.log(error);
    }
  };

  const createContract = async (data) => {
    if (account) {
      const signer = library["getSigner"](account);
      const contractFactory = new ContractFactory(
        abi,
        contractBytecode.bytecode,
        signer
      );
      try {
        const newContract = await contractFactory.deploy(
          data,
          "https://contract.qoinpay.id"
        );
        // console.log(newContract);
        // await newContract.deployTransaction.wait();
        // provider.getCode(newContract.address).then(console.log);
        // console.log(await newContract.eventName());
        localStorage.setItem("contract", newContract.address);
        console.log("contract deployed", newContract.address);
        // const tx = await newContract.buyTicket(0, ["VIP", "Reguler"], [2, 5], 0);
        // console.log(await tx.wait());
        // console.log("token owner :", await newContract.ownerOf(1));
        window.location.href = "/";
      } catch (error) {
        console.log(error);
      }
    } else {
      connectWallet();
    }
  };

  const getContractDetails = async () => {
    await connectWallet();
    try {
      const address = localStorage.getItem("contract");
      const contract = new Contract(address, abi, provider);
      return {
        address: contract.address,
        name: await contract.eventName(),
        location: await contract.eventLocation(),
        date:
          Number((await contract.dailyEvents(0)).toString().split(",")[0]) *
          1000,
        // details: String(await contract.getAllEventDetails()),
        // tickets: String(await contract.getTicketDetails()),
        days: Number(String(await contract.totalDays())),
      };
    } catch (error) {
      console.log(error);
    }
  };

  const buyTicket = async (vipQty = 0, regulerQty = 0) => {
    
    try {
      const address = localStorage.getItem("contract");
      const signer = library["getSigner"](account);
      const contract = new Contract(address, abi, signer);
      const tx = await contract.buyTicket(
        0,
        ["VIP", "Regular"],
        [vipQty, regulerQty],
        0
      );
      await tx.wait();
      alert("Purchased Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    buyTicket,
    createContract,
    getContractDetails,
  };
};
