import axios from "axios";
import FormData from "form-data";
// require("dotenv").config();

interface PinataResponse {
  success: boolean;
  pinataURL?: string;
  pinataHash?: string;
  message?: string;
}

const key: string | undefined = process.env.REACT_APP_PINATA_KEY;
const secret: string | undefined = process.env.REACT_APP_PINATA_SECRET;

export const uploadJSONToIPFS = async (
  JSONBody: Record<string, any>
): Promise<PinataResponse> => {
  if (!key || !secret) {
    return {
      success: false,
      message: "Missing PINATA API key or secret",
    };
  }

  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  try {
    const response = await axios.post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    return {
      success: true,
      pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const uploadFileToIPFS = async (
  file: File | null
): Promise<PinataResponse> => {
  if (!key || !secret) {
    return {
      success: false,
      message: "Missing PINATA API key or secret",
    };
  }

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const data = new FormData();
  data.append("file", file);

  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  try {
    const response = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.setBoundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    console.log("file uploaded", response.data.IpfsHash);
    return {
      success: true,
      pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      pinataHash: response.data.IpfsHash,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};
