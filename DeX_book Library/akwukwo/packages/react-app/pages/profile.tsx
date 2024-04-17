import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import NftCard from "../components/NftCard";
import dummyData from "../utils/data";
import {
  getAllNFTs,
  tokenURI,
  GetIpfsUrlFromPinata,
  getMyNFTs,
} from "../utils/functions";

declare var window: any;
const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async (): Promise<string | null> => {
  try {
    const ethereum = getEthereumObject();

    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      alert("get metamask account");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = (await ethereum.request({
      method: "eth_accounts",
    })) as string[];

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function Profile() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [myNfts, setMyNfts] = useState<any | null>([]);
  const [fetched, setFetched] = useState<any | null>(false);

  const getNfts = async () => {
    let call = await getMyNFTs();

    //Fetch all the details of every NFT from the contract and display
    let nfts = await Promise.all(
      call.map(async (i: any) => {
        let tokenUri = await tokenURI(i.tokenId);
        tokenUri = GetIpfsUrlFromPinata(tokenUri);
        let metadata: any = await axios.get(tokenUri);
        metadata = metadata.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          listed: i.currentlyListed,
          image: metadata.image,
          name: metadata.name,
          author: metadata.author,
          content: metadata.content,
          description: metadata.description,
        };
        return item;
      })
    );
    setFetched(true);
    setMyNfts(nfts);
  };

  useEffect(() => {
    const findAccount = async () => {
      await getNfts();

      const account = await findMetaMaskAccount();
      if (account !== null) {
        setWallet(account);
      }
    };

    findAccount();
  }, []);

  return (
    <div>
      <div>
        <h1> My Book Collection</h1>
        <p>total Books: {myNfts.length}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6 lg:p-8">
          {myNfts.map((item: any, index: any) => (
            <NftCard
              key={index}
              tokenId={item.tokenId}
              image={item.image}
              title={item.title}
              author={item.author}
              description={item.description}
              content={item.content}
              //   volume={item.volume}
              owner={item.owner}
              seller={item.seller}
              price={item.price}
              listed={item.listed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
