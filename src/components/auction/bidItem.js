import "./bidItem.css";

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Explore1Item from "../explore/explore1/explore1Item";
import TagImg from "../../assets/item/tag.png";
// import PeopleImg from "../../assets/item/people.png";

import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Web3EthContract from "web3-eth-contract";
function BidItem(props) {
  const [data, setData] = useState([]);
  // const [owner, setOwner] = useState("");
  const [buyNow, setBuyNow] = useState(0);
  // const [minPrice, setMinPrice] = useState(0);

  let navigate = useNavigate();
  // const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [firstLoad, setFirstLoad] = useState(true);

  const getURL = (i) =>{
    return getURLPromise(i);
  }

  const getURLPromise = (i) =>{
    return new Promise ((resolve) =>{
      return resolve(blockchain.akachiNFT.methods._tokenURI(i).call())
    })
  }

  const getNFTs = (url) =>{
    return getNFTPromise(url)
  }

  const getNFTPromise = (url) =>{
    return new Promise ((resolve) => {
      return resolve(
        axios.get(url)
      )
    })
  }
  
  useEffect(() => {
    async function getData(){
      if (firstLoad) {
        // console.log(props);
        if (blockchain.account === null) {
          navigate("/");
        }
        const url = await getURL(props.id)
        const result = await getNFTs(url.split("https://gateway.pinata.cloud/ipfs/")[1])
        console.log("result:", result.data, );
        var data = result.data;
        setData({ 
          "image": data.image,
          "title": data.name,
          "contract": process.env.REACT_APP_AKACHI_NFT_CONTRACT,
          "tokenId": props.id,
          "akachiNFT": "true"
        })
        blockchain.smartContract.methods
          .nftContractAuctions(props.contract, props.id)
          .call()
          .then((res)=>{
            console.log("price:", res)
            setBuyNow(blockchain.web3.utils.fromWei(res.buyNowPrice, "ether"));
          });
        setFirstLoad(false);
      }
    }
    getData();
    //eslint-disable-next-line
  }, [firstLoad]);// eslint-disable-next-line

  const onBuyNow = () => {
    // const akachiTokenContract = new Web3EthContract(
    //   AkachiToken,
    //   "0x8119841E9c4e2658B36817Cfe58dfDFDca043930"
    // );
    // akachiTokenContract.methods
    //   .approve(process.env.REACT_APP_AUCTION_NFT_CONTRACT, blockchain.web3.utils.toWei(buyNow, "ether") )
    //   .send({ from: blockchain.account })
    //   .once("error", (err) => {
    //     console.log(err);
    //   })
    //   .then(() => {
    //     console.log("success");
    //   });
    blockchain.akachiNFT.methods
      .setApprovalForAll(process.env.REACT_APP_AUCTION_NFT_CONTRACT, true)
      .send({ from: blockchain.account })
      .once("error", (err) => {
        console.log(err);
      })
      .then(() => {
        console.log("success");
      });
    blockchain.smartContract.methods
      .makeBid(props.contract, props.id, 0)
      .send({
        value:blockchain.web3.utils.toWei(buyNow, "ether"),
        from: blockchain.account 
      })
      .once("error", (err) => {
        console.log(err);
      })
      .then(() => {
        console.log("success");
      });
  };
  return (
    <div className="bidItem-layout">
      <Container>
        <Row>
          <Col lg="4">
            <h2 className="bidItem-title">Preview item</h2>
            <Explore1Item
              title={data.title}
              image={data.image}
              net="BSC"
              // owner={owner}
              // price="Current Bid"
              // priceItem="4.89ETH"
              bidding={false}
              navable={false}
              akachiNFT = {true}
            />
          </Col>
          <Col lg="8">
            <h2 className="bidItem-title">Select method</h2>
            <Row>
              <Col lg="8">
                <button
                  className="bidItem-method selected"
                  onClick={() => onBuyNow()}
                >
                  <img src={TagImg} alt="" className="button-img" />
                  Buy Now ({buyNow})
                </button>
              </Col>
            </Row>
            {/* <h2 className="bidItem-title">Min Price</h2>
            <Input1
              margin="1em"
              text="Enter minimum price for one item (AkachiToken)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            /> */}
            {/* <h2 className="bidItem-title">Buy Now</h2>
            <Input1 margin="1em" text="Enter buy now price for one item (AkachiToken)" value = {buyNow} onChange = {(e)=>setBuyNow(e.target.value)}/> */}
            {/* <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <button
                className="bidItem-create-btn"
                onClick={() => onCreateAuction()}
              >
                Start Auction
              </button>
            </div> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default BidItem;
