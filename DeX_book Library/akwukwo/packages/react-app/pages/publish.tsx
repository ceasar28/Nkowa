import React, { useState, ChangeEvent, useEffect } from "react";
import { uploadJSONToIPFS, uploadFileToIPFS } from "../utils/pinata";
import { createToken, getAllNFTs } from "../utils/functions";
import { useRouter } from "next/navigation";
declare var window: any;

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
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

export default function Publish() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfFileName, setPDFFileName] = useState<string | null>(null);
  const [textBoxValue, setTextBoxValue] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [numberValue, setNumberValue] = useState<number | null>(null);
  const [priceValue, setPriceValue] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handlePDFChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPDF(file);
      setPDFFileName(file.name);
    }
  };

  const handleTextBoxChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBoxValue(event.target.value);
  };

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
  };

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setNumberValue(isNaN(value) ? null : value);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setPriceValue(isNaN(value) ? null : value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted:", {
      name,
      author,
      selectedImage,
      selectedPDF,
      textBoxValue,
      genre,
      numberValue,
      priceValue,
    });
    setMessage("Pining to IPFS, this usually take some mins.......");
    const pinPdf = await uploadFileToIPFS(selectedPDF);
    const pinImg = await uploadFileToIPFS(selectedImage);

    try {
      if (pinPdf && pinImg) {
        const metaData = await uploadJSONToIPFS({
          name: name,
          description: textBoxValue,
          image: pinImg.pinataURL,
          attributes: [{ trait_type: "Booke", value: "book" }],
          author: author,
          genre: genre,
          content: pinPdf.pinataHash,
        });
        if (metaData.pinataURL) {
          let data: any = {
            tokenURI: metaData.pinataURL,
            price: priceValue,
            number: numberValue,
          };
          console.log(wallet);
          // call the createtoken function here
          const mint = await createToken(data);
          setMessage("Minting..........");
          if (mint) {
            alert("Transaction completed");
            router.push("/explore");
          }

          console.log(mint);
        }
      }
    } catch (error) {
      setMessage("Please try again, there was an error");
      console.log(error);
    }
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
    <div className="p-4 border rounded shadow-md ">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Title
          </label>
          <input
            type="text"
            id="name"
            className="form-input w-full"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="author"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            className="form-input w-full"
            value={author}
            onChange={handleAuthorChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
            Cover Image
          </label>
          <input
            type="file"
            id="image"
            className="form-input w-full"
            onChange={handleImageChange}
            required
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="mt-2 h-24" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="pdf">
            Book/Article pdf
          </label>
          <input
            type="file"
            id="pdf"
            className="form-input w-full"
            accept=".pdf"
            onChange={handlePDFChange}
            required
          />
          {pdfFileName && (
            <p className="mt-2">{`Selected PDF: ${pdfFileName}`}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="textBox"
          >
            Description
          </label>
          <textarea
            id="textBox"
            className="form-input w-full"
            rows={4}
            value={textBoxValue}
            onChange={handleTextBoxChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="genre">
            Category/Genre
          </label>

          <select
            id="genre"
            className="form-input w-full"
            value={genre !== null ? genre : ""}
            onChange={handleGenreChange}
            required
          >
            <option value="educational">Educational</option>
            <option value="sci/fi">Science/Fiction</option>
            <option value="romance">Romance</option>
            <option value="children">Children</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="number"
          >
            Number to Publish
          </label>
          <input
            type="number"
            id="number"
            className="form-input w-full"
            value={numberValue !== null ? numberValue : ""}
            onChange={handleNumberChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
            Price in Ether
          </label>
          <input
            type="number"
            id="price"
            className="form-input w-full"
            value={priceValue !== null ? priceValue : ""}
            onChange={handlePriceChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Publish
        </button>
      </form>
      <h4>{message}</h4>
    </div>
  );
}
