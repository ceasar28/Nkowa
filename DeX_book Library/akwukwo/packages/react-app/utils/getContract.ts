import { ethers } from "ethers";
import contractAbi from "./abi.json";
declare var window: any;

export const getContract = async (): Promise<ethers.Contract> => {
  const CONTRACT_ADDRESS: string | undefined =
    "0x4C0532939Fe4aac1642D4BD022d49Dba05F4b708";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://alfajores-forno.celo-testnet.org"
  // );

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

  return contract;
};
