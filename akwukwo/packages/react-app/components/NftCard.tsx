import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "../components/DetailModal";
import { executeSale } from "../utils/functions";
import Link from "next/link";

interface CardProps {
  image: string;
  title: string;
  author: string;
  description: string;
  content: string;
  tokenId: number;
  seller: string;
  //   volume: number;
  owner: string;
  price: number;
  listed: any;
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  author,
  description,
  content,
  tokenId,
  seller,
  //   volume,
  owner,
  listed,
  price,
}) => {
  const [isOpen, Close] = useState<boolean | null>(false);

  const sale: any = async () => {
    let data = {
      price: price,
      tokenId: tokenId,
    };
    if (tokenId) {
      const execute: any = await executeSale(data);
      console.log(execute);
      return execute;
    }
    alert("please connect your wallet..");
  };

  const router: any = useRouter();

  const handleModal = () => {
    Close(true);
  };
  const closeModal = () => {
    Close(false);
  };

  // const handleRead = () => {
  //   Close(true);
  // };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-1">By {author}</p>
        {/* <p className="text-gray-600 mb-1"> {volume} available</p> */}
        <p className="text-gray-600 mb-1"> {seller}</p>
        <p className="text-green-600 font-semibold">
          {/* //{price.toFixed(2)} Ethers */}
          {price} Ethers
        </p>

        {router.route === "/profile" ? (
          <Link
            href={`https://gateway.pinata.cloud/ipfs/${content}`}
            target="_blank"
          >
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Read
            </button>
          </Link>
        ) : (
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleModal}
          >
            View
          </button>
        )}
        {router.route === "/explore" ? (
          <button
            onClick={sale}
            className="mt-2 mx-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Buy
          </button>
        ) : (
          <button
            className="mt-2 mx-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleModal}
          >
            View
          </button>
        )}
      </div>
      {isOpen === true ? (
        <Modal
          onClose={closeModal}
          image={image}
          title={title}
          author={author}
          description={description}
          content={content}
          owner={owner}
          price={price}
          tokenId={tokenId}
          seller={seller}
          listed ={listed}
        ></Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Card;
