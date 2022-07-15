import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import WalletItem from "./walletItem";
import "./walletComp.css";
import MetaImg from "../../assets/wallet/metamask.png";
// import CoinImg from "../../assets/wallet/coinbase.png";
import { fetchData } from "../../redux/data/dataActions";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";

function WalletComp() {
  const dataWallet = [
    {
      img: MetaImg,
      wallet: "MetaMask",
      text: "MetaMask is a software cryptocurrency wallet used to interact with the Ethereum blockchain. It allows users to access their Ethereum wallet through a browser extension to interact with Dapps.",
    },
    // {
    //   img: CoinImg,
    //   wallet: "Coinbase Wallet",
    //   text: "Coinbase Wallet is a self-custody crypto wallet, putting you in control of your crypto, keys, and data. Now you can safely store your crypto and rare NFTs in your Coinbase wallet.",
    // },
  ];
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };
  useEffect(() => {
    getData();
  }, [blockchain.account]); // eslint-disable-line react-hooks/exhaustive-deps

  // console.log("blockchain", blockchain);
  return (
    <div className="walletComp-layout">
      <Container>
        {blockchain.account === null ? (
          <div>
            <div className="walletComp-title-layout">
              <h2 className="walletComp-title">Connect Wallet</h2>
              <div className="bottomBar"></div>
              <p className="walletComp-text">
                Connect your Metamask wallet!
              </p>
            </div>
            
            <Row>
              
            </Row>
            <Row>
              {dataWallet.map((item, index) => (
                <Col lg="12" key={index}>
                  <WalletItem
                    img={item.img}
                    wallet={item.wallet}
                    text={item.text}
                  />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Row>
            <h2 className="walletComp-title">
              {blockchain.wallet} is connected.
            </h2>
            <p className="walletComp-text">{blockchain.account}</p>
          </Row>
        )}
        <Modal show={data.loading} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Wait a min, please!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            We are preparing some data for the marketplace.
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default WalletComp;
