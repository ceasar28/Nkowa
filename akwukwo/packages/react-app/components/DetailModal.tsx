import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import {
  executeSale,
  listToken,
  deListToken,
  getAllNFTs,
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

interface ModalProps {
  //   isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  author: string;
  description: string;
  content: string;
  owner: string;
  price: number;
  tokenId: number;
  seller: string;
  listed: any;
}

const Modal: React.FC<ModalProps> = ({
  //   isOpen,
  onClose,
  image,
  title,
  author,
  description,
  content,
  owner,
  price,
  tokenId,
  seller,
  listed,
}) => {
  const [wallet, setWallet] = useState<string | null>(null);
  useState<number | null>(null);
  const [priceValue, setPriceValue] = useState<number | null>(null);

  const router: any = useRouter();
  console.log(listed);
  // const router = useRouter();

  const sale: any = async () => {
    let data = {
      price: price,
      tokenId: tokenId,
    };
    if (wallet) {
      const execute: any = await executeSale(data);

      console.log(execute);
      return execute;
    }
    alert("please connect your wallet..");
  };

  const list: any = async () => {
    let data = {
      price: priceValue,
      tokenId: tokenId,
    };
    if (wallet && priceValue !== null) {
      const execute: any = await listToken(data);
      if (execute) {
        alert("transaction processed");
        await getMyNFTs();
        console.log(execute);
        return execute;
      }
    }
    alert("please make sure price is not 0 and your wallet is connected.");
  };
  const handlePriceChange = (event: any) => {
    const value = parseFloat(event.target.value);
    console.log(value);
    setPriceValue(isNaN(value) ? null : value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await list();
  };

  const deList: any = async () => {
    let data = {
      tokenId: tokenId,
    };
    if (wallet) {
      const execute: any = await deListToken(data);
      if (execute) {
        alert("transaction processed");
        await getMyNFTs();
        console.log(execute);
        return execute;
      }
    }
    alert("please connect your wallet..");
  };

  useEffect(() => {
    const findAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setWallet(account);
      }
    };

    findAccount();
  }, []);

  return (
    <div className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-4 rounded-lg w-70vw  shadow-lg flex">
        <div className="modal-image mr-4">
          <img src={image} alt={title} className="w-40 h-auto object-cover" />
          {router.route === "/profile" ? (
            <>
              <Link
                href={`https://gateway.pinata.cloud/ipfs/${content}`}
                target="_blank"
              >
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg w-full">
                  Read
                </button>
              </Link>
              {listed == true ? (
                <button
                  onClick={deList}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
                >
                  Delist
                </button>
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
                    >
                      list
                    </button>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="price"
                    >
                      New Price in ether
                    </label>
                    <input
                      type="number"
                      id="price"
                      className="form-input w-full border-2  border-black"
                      value={priceValue !== null ? priceValue : ""}
                      onChange={handlePriceChange}
                      required
                    />
                  </form>
                </>
              )}
            </>
          ) : (
            <button
              onClick={sale}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
            >
              Buy
            </button>
          )}
        </div>
        <div className="modal-details flex-grow overflow-x-auto ">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-1">By {author}</p>
          <p className="mb-2 whitespace-pre-wrap">
            {" "}
            Description: {description}
          </p>
          <p className="mb-2">Owner: {seller}</p>
          <p className="text-green-600 font-semibold">{price} ether</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="modal-close absolute top-2 right-0 p-5 text-black-500 hover:text-gray-1700 font-bold text-xl"
      >
        Close &#x2716;
      </button>
    </div>
  );
};

export default Modal;
