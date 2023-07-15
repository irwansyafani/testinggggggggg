import abi from "./contract.json";
import contractBytecode from "./bytecode.json";
import { ContractFactory, Contract } from "@ethersproject/contracts";
import { AlchemyProvider } from "@ethersproject/providers";
// import { Wallet } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connector";
import { toast } from "react-hot-toast";

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
        toast.promise(newContract.deployTransaction.wait(5), {
          error: "Unable to create the contract",
          loading: "Creating contract...",
          success: () => {
            localStorage.setItem("contract", newContract.address);
            console.log("contract deployed", newContract.address);
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
            return `Contract created: ${newContract.address}`;
          },
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.promise(connectWallet(), {
        error: "Unable to connect to your account",
        loading: "Connecting Account",
        success: "Account connected, now you can do continue",
      });
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
      toast.promise(tx.wait(), {
        error: "Unable to purchase a ticket",
        loading: "Buy is in process",
        success: "Purchased Successfully",
      });
    } catch (error) {
      toast.error("Unable to proceed, please check console");
      console.log(error);
    }
  };

  return {
    buyTicket,
    createContract,
    getContractDetails,
  };
};
