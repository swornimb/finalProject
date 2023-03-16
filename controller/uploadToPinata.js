const pinataSdk = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { Readable, Stream } = require("stream");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSdk(pinataApiKey, pinataApiSecret);

async function storeImage(imageName, imagesFile) {
  // const fullImagesPath = path.resolve(imagesFilePath);
  // console.log(fullImagesPath);
  console.log("Uploading to IPFS");

  // const readableStreamForFile = fs.createReadStream(imageName);
  // console.log(readableStreamForFile);
  var stream = Readable.from(imagesFile);
  const options = {
    pinataMetadata: {
      name: imageName,
    },
  };
  try {
    const response = await pinata.pinFileToIPFS(stream, options);
    console.log(response);
    return { response, stream };
  } catch (e) {
    console.log(e);
  }
}

async function storeTokenUriMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  };
  try {
    const response = await pinata.pinJSONToIPFS(metadata, options);
    return response;
  } catch (error) {
    // console.log(error);
  }
  return null;
}

module.exports = { storeImage, storeTokenUriMetadata };
