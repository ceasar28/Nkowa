// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Akwukwo1 is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter public _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    //implementing zero listing fee;
    //uint256 listPrice = 0.01 ether;
    // royalty price
    uint256 salesPercentage = 5; //5%
    uint256 _initialRoyaltyPercentage = 10 ; // 10%
    // address to pay royalty
    // address payable _initialRoyaltyReceiver;
    

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        address payable RoyaltyReceiver;
        uint256 Royaltyfee;
        uint256 salesfee;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        address RoyaltyReciever,
        uint256 RoyaltyFee,
        uint256 salesfee,
        uint256 price,
        bool currentlyListed
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("Akwukwo", "AKW") {
        owner = payable(msg.sender);
    }

    // function updateListPrice(uint256 _listPrice) public payable {
    //     require(owner == msg.sender, "Only owner can update listing price");
    //     listPrice = _listPrice;
    // }

    // function getListPrice() public view returns (uint256) {
    //     return listPrice;
    // }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    function createToken(string memory tokenURI, uint256 price, uint256 number) public payable returns (string memory) {
        // loop to execute when user wants to mint more than 1
        for (uint256 i = 0 ; i <number; i++){
 //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, price);
        }
       

        return "SUCCESSFULL";
    }

    function createListedToken(uint256 tokenId, uint256 _price) private {
        //Make sure the sender sent enough ETH to pay for listing
        //require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(_price > 0, "Make sure the price isn't negative");
        uint256 price = _price;
        // royalty fee
        uint256 Royaltyfee = (price * _initialRoyaltyPercentage) / 100; // Calculate the royalty amount
        uint256 salesfee = (price * salesPercentage) / 100; // caculate the salesfee to be sent to the contract owner
        

        address RoyaltyReceiver = msg.sender;  
         //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            payable(RoyaltyReceiver), // Use the provided royaltyReceiver address
            Royaltyfee,
            salesfee,
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            RoyaltyReceiver,
            Royaltyfee,
            salesfee,
            price,
            true
        );
    }

    // function to deListToken()
    function deListToken(uint256 _tokenId) public payable returns (ListedToken memory){
        
        require(idToListedToken[_tokenId].seller == msg.sender, "Only owner can delist it");
          uint256 Royaltyfee = idToListedToken[_tokenId].Royaltyfee;
        uint256 salesfee = idToListedToken[_tokenId].salesfee;
        address RoyaltyReceiver = idToListedToken[_tokenId].RoyaltyReceiver;
        uint price = idToListedToken[_tokenId].price;

            idToListedToken[_tokenId] = ListedToken(
            _tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(RoyaltyReceiver), // Use the provided royaltyReceiver address
            Royaltyfee,
            salesfee,
            price,
            false
        );
        _transfer(address(this), msg.sender, _tokenId);
            //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            _tokenId,
            address(this),
            msg.sender,
            RoyaltyReceiver,
            Royaltyfee,
            salesfee,
            price,
            false
        );
        
   
        return idToListedToken[_tokenId];
    }

    //function to enlist again
    function listToken (uint256 tokenId, uint256 price)public payable {
        require(idToListedToken[tokenId].seller == msg.sender, "Only owner can enlist it");
           require(price > 0, "Make sure the price isn't negative");
        // royalty fee
        uint256 Royaltyfee = (price * _initialRoyaltyPercentage) / 100; // Calculate the royalty amount
        uint256 salesfee = (price * salesPercentage) / 100; // caculate the salesfee to be sent to the contract owner
        address RoyaltyReceiver = idToListedToken[tokenId].RoyaltyReceiver;

            idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(RoyaltyReceiver), // Use the provided royaltyReceiver address
            Royaltyfee,
            salesfee,
            price,
            true
        );
        _transfer(msg.sender, address(this), tokenId);
            //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            RoyaltyReceiver,
            Royaltyfee,
            salesfee,
            price,
            true
        );
        
    }
    
    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        
        //Important to get a count of all the NFTs that are listed before we can make an array for them
        for(uint i=0;i<nftCount;i++)
        {

            // to filter non listed tokens
            if(idToListedToken[i+1].currentlyListed == true){
                itemCount += 1;
                 }

          }      
          //Once you have the count of listed NFTs, create an array then store all the NFTs in it 
          ListedToken[] memory tokens = new ListedToken[](itemCount);
           for(uint i=0;i<nftCount;i++)
        {
            if(idToListedToken[i+1].currentlyListed == true){
                uint currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }    
           

            
       
        //the array 'tokens' has the list of all NFTs in the marketplace
                return tokens;
        
    }
    
    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;
        uint256 salesfee = idToListedToken[tokenId].salesfee;
        uint256 royaltyfee = idToListedToken[tokenId].Royaltyfee;
        address seller = idToListedToken[tokenId].seller;
        address royaltyOwner = idToListedToken[tokenId].RoyaltyReceiver;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

       
        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(salesfee);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value - (royaltyfee + salesfee));
        //transfer the royalty fee to the main owner
        payable(royaltyOwner).transfer(royaltyfee);
    }

}

