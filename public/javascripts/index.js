import { ethers } from "./ethers-5.2.esm.min.js";
import {
  abi,
  contractAddress,
  photographAbi,
  walletAddress,
} from "./constants.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

var connectButton = document.getElementById("connect_button");
var addPhoto = document.getElementById("add_photo");
var photoContainer = document.getElementById("allPhoto");
var sentEthers = document.getElementById("ethers");
var royalty = document.getElementById("royalty");
var fileName = document.getElementById("filename");
var searchItem = document.getElementById("search");
var sarchIcon = document.getElementById("searchit");
var title = document.getElementById("title");
var description = document.getElementById("description");

let photoValue = {};

fileName.onchange = imageObject;
searchItem.onchange = searchImage;
connectButton.onclick = connect;
addPhoto.onclick = addNewPhoto;

const socket = io("http://localhost:3000/");

//Get all contracts
const provider = new ethers.providers.Web3Provider(window.ethereum);
const web3Signer = provider.getSigner(walletAddress);
const contract = new ethers.Contract(contractAddress, abi, web3Signer);
const contractList = await contract.getPhotographAddresses();
console.log(contractList);
for (var i = 0; i < contractList.length; i++) {
  var contract_wallet = await contract.contractToWallet[contractList[i]];
  var getcontractImage = new ethers.Contract(
    contractList[i],
    photographAbi,
    provider.getSigner(contract_wallet)
  );
  let contractImage = await getcontractImage.getPhoto();
  console.log(contractImage);
  let parentDiv = document.createElement("div");
  parentDiv.setAttribute("class", "imageDiv");
  let elem = document.createElement("img");
  elem.setAttribute("src", contractImage);
  parentDiv.append(elem);

  let overlay = document.createElement("a");
  overlay.setAttribute("class", "overlay");
  overlay.setAttribute("data-toggle", "modal");
  overlay.setAttribute("data-target", `#${contractList[i]}`);
  parentDiv.append(overlay);

  //Modal Element Creation

  let imageModel = document.createElement("div");
  imageModel.setAttribute("class", "modal fade");
  imageModel.setAttribute("id", contractList[i]);
  imageModel.setAttribute("role", "dialog");

  let modalDialog = document.createElement("div");
  modalDialog.setAttribute("class", "modal-dialog modal-lg");

  let modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal-content");
  let modalHeader = document.createElement("div");
  modalHeader.setAttribute("class", "modal-header");
  let headerTitle = document.createElement("h4");
  headerTitle.setAttribute("class", "modal-title");
  headerTitle.innerText = `Contract Address: ${contractList[i]}`;
  let modalBody = document.createElement("div");
  modalBody.setAttribute("class", "modal-body photoDetail");

  let imageInModal = document.createElement("div");
  imageInModal.setAttribute("class", "photoBanner");

  imageInModal.setAttribute("class", "transaction");

  var item = document.createElement("div");
  item.setAttribute("class", "item photoDetail-item");

  var buysell = document.createElement("div");
  buysell.setAttribute("class", "item buySell");

  if (
    (await provider.getSigner().getAddress()) ==
    (await getcontractImage.getOwner())
  ) {
    // For Owner image controls
    let priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "setprice");
    let setprice = document.createElement("input");
    setprice.setAttribute("type", "number");
    setprice.setAttribute("id", `priceInbox${contractList[i]}`);
    setprice.setAttribute("value", await getcontractImage.getPrice());
    priceDiv.append(setprice);
    let buyButton = document.createElement("button");
    buyButton.setAttribute("class", "setPriceButton");
    buyButton.setAttribute("id", contractList[i]);
    buyButton.innerHTML = "Set Price";
    priceDiv.append(buyButton);
    buysell.append(priceDiv);

    let selectTag = document.createElement("select");
    selectTag.setAttribute("class", "imageState");
    selectTag.setAttribute("id", contractList[i]);

    let viewOnly = document.createElement("option");
    viewOnly.setAttribute("value", "false");
    viewOnly.innerHTML = "View";

    let sellImage = document.createElement("option");
    sellImage.setAttribute("value", "true");
    sellImage.innerHTML = "Sell";

    if (await getcontractImage.getImageState()) {
      selectTag.append(sellImage);
      selectTag.append(viewOnly);
    } else {
      selectTag.append(viewOnly);
      selectTag.append(sellImage);
    }

    buysell.append(selectTag);
  } else {
    if (await getcontractImage.getImageState()) {
      let buyButton = document.createElement("button");
      buyButton.setAttribute("class", "wallet");
      buyButton.setAttribute("id", contractList[i]);
      buyButton.innerHTML = "Buy";
      buysell.append(buyButton);
    }
  }

  var title1 = document.createElement("div");
  title1.setAttribute("class", "image-info");
  title1.innerHTML = `<b>Title: </b>${await getcontractImage.getTitle()}`;

  var description1 = document.createElement("div");
  description1.setAttribute("class", "image-info");
  description1.innerHTML = `<b>Description: </b>${await getcontractImage.getDescription()}`;

  var detail = document.createElement("div");
  detail.setAttribute("class", "image-info");
  detail.innerHTML = `<b>Owner: </b>${await getcontractImage.getOwner()}`;

  var detail2 = document.createElement("div");
  detail2.setAttribute("class", "image-info");
  detail2.innerHTML = `<b>Price: </b>${await getcontractImage.getPrice()} ETH`;

  var detail3 = document.createElement("div");
  detail3.setAttribute("class", "image-info");
  detail3.innerHTML = `<b>Royalty: </b>${await getcontractImage.getRoyalty()}%`;

  item.append(title1);
  item.append(description1);
  item.append(detail);
  item.append(detail2);
  item.append(detail3);
  item.append(buysell);

  let imgInBanner = document.createElement("img");
  imgInBanner.setAttribute("src", contractImage);

  imageInModal.append(imgInBanner);
  modalBody.append(imageInModal);
  modalBody.append(item);

  modalHeader.append(headerTitle);
  modalHeader.append(modalBody);

  modalContent.append(modalHeader);

  modalDialog.append(modalContent);

  imageModel.append(modalDialog);

  photoContainer.prepend(imageModel);
  photoContainer.prepend(parentDiv);
}

var buyPhoto = document.querySelectorAll(".wallet");
for (let i = 0; i < buyPhoto.length; i++) {
  buyPhoto[i].addEventListener("click", (e) => {
    buyImage(e.target.id);
  });
}

var setPrice = document.querySelectorAll(".setPrice");
for (let i = 0; i < setPrice.length; i++) {
  setPrice[i].addEventListener("click", (e) => {
    setPriceFunc(e.target.id);
  });
}

var imageState = document.querySelectorAll(".imageState");
for (let i = 0; i < setPrice.length; i++) {
  imageState[i].addEventListener("change", (e) => {
    console.log(e.target.value);
    console.log(e.target.id);
    imageStateToggle(e.target.id, e.target.value);
  });
}

// Connect Metamask
async function connect() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  location.reload();
}

// Add new photo contract
async function addNewPhoto() {
  if (typeof window.ethereum !== "undefined") {
    var titleData = title.value;
    console.log(titleData);
    var descriptionData = description.value;
    var imageData = photoValue;
    var imageName = fileName.value;
    var etherSent = sentEthers.value;
    var royaltySet = parseFloat(royalty.value);

    let uploadImage = document.querySelector("#secTab");
    uploadImage.style.display = "none";

    let previousButton = document.querySelector("#previousButton");
    previousButton.style.display = "none";

    let loader = document.querySelector(".loader");
    loader.style.display = "block";

    var status = document.querySelector(".status");

    socket.emit("upload-image", imageName, imageData);
    socket.on("status", (data) => {
      status.innerHTML = data;
    });
    var allData = [];
    allData = await asyncRecieveData();
    var imageString = allData[0];
    var derivedHash = allData[1];
    console.log(derivedHash);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const allHash = await contract.viewHashData();
    var flag = 0;
    for (var i = 0; i < allHash.length; i++) {
      var stringData = allHash[i];
      var hammmingDist = hammingDistance(stringData, derivedHash);
      if (hammmingDist <= 5) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        var getcontractImage = new ethers.Contract(
          (await contract.getPhotographAddresses())[i],
          photographAbi,
          provider
        );
        var pic = await getcontractImage.getPhoto();
        console.log(pic);
        var owner = await getcontractImage.getOwner();
        console.log(owner);
        var similarPercentage = ((64 - parseInt(hammmingDist)) / 64) * 100;
        socket.emit("pdf-maker", pic, owner, imageString, similarPercentage);
        flag = 1;
        location.reload();
      }
    }
    if (flag === 0) {
      const transaction = await contract.createPhotographContract(
        titleData,
        descriptionData,
        imageString,
        etherSent,
        signerAddress,
        derivedHash,
        royaltySet
      );
      console.log(transaction);
      const thash = await transaction.hash;
      await listentransaction(transaction, provider);
      console.log(await contract.viewHashData());
      location.reload();
    }
  }
}

async function searchImage(e) {
  if (typeof window.ethereum !== "undefined") {
    sarchIcon.classList.add("animate");

    var imageData = e.target.files[0];
    var imageName = searchItem.value;

    let uploadImage = document.querySelector("#secTab");
    uploadImage.style.display = "none";

    let previousButton = document.querySelector("#previousButton");
    previousButton.style.display = "none";

    let loader = document.querySelector(".loader");
    loader.style.display = "block";

    socket.emit("upload-image", imageName, imageData);

    var allData = [];
    allData = await asyncRecieveData();
    var imageString = allData[0];
    var derivedHash = allData[1];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const allHash = await contract.viewHashData();
    var flag = 0;
    for (var i = 0; i < allHash.length; i++) {
      var stringData = allHash[i];
      var hammmingDist = hammingDistance(stringData, derivedHash);
      if (hammmingDist <= 5) {
        var contract_wallet = await contract.contractToWallet[contractList[i]];
        var getcontractImage = new ethers.Contract(
          (await contract.getPhotographAddresses())[i],
          photographAbi,
          provider.getSigner(contract_wallet)
        );
        var popup = document.getElementById("popup");
        let modalDialog = document.createElement("div");
        modalDialog.setAttribute("class", "modal-dialog modal-lg");

        let modalContent = document.createElement("div");
        modalContent.setAttribute("class", "modal-content");

        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.classList.add("close");
        button.setAttribute("id", "popup");
        button.innerHTML = "&times;";

        let modalHeader = document.createElement("div");
        modalHeader.setAttribute("class", "modal-header");
        let headerTitle = document.createElement("h4");
        headerTitle.setAttribute("class", "modal-title");
        headerTitle.innerText = `Contract Address: ${contractList[i]}`;
        let modalBody = document.createElement("div");
        modalBody.setAttribute("class", "modal-body photoDetail");

        let imageInModal = document.createElement("div");
        imageInModal.setAttribute("class", "photoBanner");

        imageInModal.setAttribute("class", "transaction");
        let imgInBanner = document.createElement("img");
        imgInBanner.setAttribute("src", await getcontractImage.getPhoto());

        let itemSearch = document.createElement("div");
        itemSearch.setAttribute("class", "item photoDetail-item");

        let title2 = document.createElement("div");
        title2.setAttribute("class", "image-info");
        title2.innerHTML = `<b>Title: </b>${await getcontractImage.getTitle()}`;

        let description2 = document.createElement("div");
        description2.setAttribute("class", "image-info");
        description2.innerHTML = `<b>Description: </b>${await getcontractImage.getDescription()}`;

        let detailsearch = document.createElement("div");
        detailsearch.setAttribute("class", "image-info");
        detailsearch.innerHTML = `<b>Owner: </b>${await getcontractImage.getOwner()}`;

        let detailsearch2 = document.createElement("div");
        detailsearch2.setAttribute("class", "image-info");
        detailsearch2.innerHTML = `<b>Price: </b>${await getcontractImage.getPrice()} ETH`;

        let detailsearch3 = document.createElement("div");
        detailsearch3.setAttribute("class", "image-info");
        detailsearch3.innerHTML = `<b>Royalty: </b>${await getcontractImage.getRoyalty()}%`;

        itemSearch.append(title2);
        itemSearch.append(description2);
        itemSearch.append(detailsearch);
        itemSearch.append(detailsearch2);
        itemSearch.append(detailsearch3);

        imageInModal.append(imgInBanner);
        modalBody.append(imageInModal);
        modalBody.append(itemSearch);
        modalHeader.append(button);
        modalHeader.append(headerTitle);
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalDialog.append(modalContent);
        let imageModel = document.createElement("div");
        imageModel.setAttribute("class", "modal fade in modal-bg ");
        imageModel.setAttribute("style", "display: block");
        imageModel.setAttribute("role", "dialog");
        imageModel.setAttribute("id", "exampleModal");
        imageModel.append(modalDialog);
        popup.append(imageModel);

        var modell = document.getElementById("popup");
        modell.onclick = () => {
          return location.reload();
        };
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      alert("No image found");
    }
  }
}

function asyncRecieveData() {
  return new Promise(function (resolve, reject) {
    socket.on("data-collection", (imagestring, derivedhash) => {
      resolve([imagestring, derivedhash]);
    });
  });
}

function listentransaction(transaction, provider) {
  return new Promise((resolve, reject) => {
    provider.once(transaction.hash, (transactionReciept) => {
      console.log(transactionReciept.confirmations);
      console.log("done");
      resolve();
    });
  });
}

const hammingDistance = (arrayData, hashData) => {
  var hammingData = 0;
  for (var j = 0; j < arrayData.length; j++) {
    if (arrayData[j] != hashData[j]) {
      hammingData++;
    }
  }
  console.log(hammingData);
  return hammingData;
};

async function buyImage(contractId) {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let contract = new ethers.Contract(contractId, photographAbi, signer);
  let sellingPrice = await contract.getPrice();
  let transaction = await contract.buyPhotograph({
    value: ethers.utils.parseEther(sellingPrice.toString()),
  });
  await listentransaction(transaction, provider);
}

async function setPriceFunc(contractId) {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let contract = new ethers.Contract(contractId, photographAbi, signer);
  let setValue = document.getElementById(`priceInbox${contractId}`).value;
  setValue = parseFloat(setValue);
  let transaction = await contract.setPrice(setValue);
  await listentransaction(transaction, provider);
  location.reload();
}
async function imageStateToggle(contractId, value) {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let contract = new ethers.Contract(contractId, photographAbi, signer);
  if (value === "false") {
    var transaction = await contract.setImageToggle(false);
  } else {
    var transaction = await contract.setImageToggle(true);
  }

  await listentransaction(transaction, provider);
  location.reload();
}

function imageObject(e) {
  photoValue = e.target.files[0];
  console.log(photoValue);
}

function removeModel() {
  location.reload();
}
