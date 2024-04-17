import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import NftCard from "../components/NftCard";
import dummyData from "../utils/data";
import Modal from "../components/DetailModal";
import {
  getAllNFTs,
  tokenURI,
  GetIpfsUrlFromPinata,
  executeSale,
} from "../utils/functions";
declare var window: any;
const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
// const handleNfts = async () => {
//   let nfts = await getAllNFTs();

//   console.log(nfts);
//   return nfts;
// };

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

export default function Explore() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [allNfts, setAllNfts] = useState<any | null>([]);
  const [fetched, setFetched] = useState<any | null>(false);

  const getNfts = async () => {
    let call = await getAllNFTs();

    //Fetch all the details of every NFT from the contract and display
    let nfts = await Promise.all(
      call.map(async (i: any) => {
        let tokenUri = await tokenURI(i.tokenId);
        tokenUri = GetIpfsUrlFromPinata(tokenUri);
        let metadata: any = await axios.get(tokenUri);
        metadata = metadata.data;
        console.log(i.price);

        // turninwei ti ether value
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
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
    setAllNfts(nfts);
  };

  useEffect(() => {
    const findAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setWallet(account);
        if (fetched == false) await getNfts();
      }
    };

    findAccount();
  }, []);
  return (
    <div>
      <div>
        <h1> All listed Books</h1>
        <p>total Books: {allNfts.length}</p>
        {allNfts.length == 0 ? (
          <h1 className=" text-xl "> LOADING......</h1>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6 lg:p-8">
            {allNfts.map((item: any, index: any) => (
              <NftCard
                key={index}
                image={item.image}
                title={item.title}
                author={item.author}
                description={item.description}
                content={item.content}
                //   volume={item.volume}s
                owner={item.owner}
                price={item.price}
                tokenId={item.tokenId}
                seller={item.seller}
                listed={item.listed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
