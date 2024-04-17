import { ethers } from "ethers";
import contractAbi from "./abi.json";
declare var window: any;

export const getContract = async (): Promise<ethers.Contract> => {
  const CONTRACT_ADDRESS: string | undefined =
    "0x7da78c873f8f0e27050b97ce46802c6569a540ca";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://alfajores-forno.celo-testnet.org"
  // );

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

  return contract;
};
