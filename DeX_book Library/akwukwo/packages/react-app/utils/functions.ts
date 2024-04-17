import { getContract } from "./getContract";
import { ethers } from "ethers";

// interface PinataResponse {
//   success: boolean;
//   pinataURL?: string;
//   message?: string;
// }

export const createToken = async (data: any) => {
  const tokenURI = data.tokenURI;
  const price = (data.price * 10 ** 18).toString();
  console.log(price);
  const number = data.number;
  console.log(number);

  const contract = await getContract();
  //const salePrice = ethers.utils.parseUnits(data.price, "ether");
  // the listing price value to be passed
  const options = { value: (0.01 * 10 ** 18).toString() };
  //const options = { value: ethers.utils.parseUnits(price, "ether") };
  console.log(options);
  const transactionResponse = await contract.createToken(
    tokenURI,
    price,
    number
  );

  return transactionResponse;
};

// to get all NFTs
export const getAllNFTs = async () => {
  const contract = await getContract();
  console.log(contract);

  const transactionResponse = await contract.getAllNFTs();

  return transactionResponse;
};

// get a user Nfts
export const getMyNFTs = async () => {
  const contract = await getContract();

  const transactionResponse = await contract.getMyNFTs();

  return transactionResponse;
};

export const tokenURI = async (data: any) => {
  const contract = await getContract();
  console.log(contract);

  const transactionResponse = await contract.tokenURI(data);

  return transactionResponse;
};

export const GetIpfsUrlFromPinata = (pinataUrl: any) => {
  var IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];
  return IPFSUrl;
};

export const executeSale = async (data: any) => {
  const tokenId = data.tokenId;
  let price = (data.price * 10 ** 18).toString();
  console.log(price);
  const contract = await getContract();

  //const options = { value: ethers.utils.parseUnits(price, "ether") };
  const options = { value: price };
  console.log(options);
  // the lcost price value to be passed

  const transactionResponse = await contract.executeSale(tokenId, options);

  return transactionResponse;
};

export const listToken = async (data: any) => {
  const tokenId = data.tokenId;
  let price = (data.price * 10 ** 18).toString();
  console.log(price);
  const contract = await getContract();

  //const options = { value: ethers.utils.parseUnits(price, "ether") };
  //const options = { value: price };
  //console.log(options);
  // the lcost price value to be passed

  const transactionResponse = await contract.listToken(tokenId, price);

  return transactionResponse;
};

export const deListToken = async (data: any) => {
  const tokenId = data.tokenId;

  const contract = await getContract();

  const transactionResponse = await contract.deListToken(tokenId);

  return transactionResponse;
};
