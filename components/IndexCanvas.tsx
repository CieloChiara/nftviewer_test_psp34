import { useEffect, useState } from "react";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ContractPromise } from '@polkadot/api-contract';
import abi from '../metadata/metadata_type_Id_3.json';
import axios from "axios";

import Header from "./Header";
import Footer from "./Footer";
import SampleContractsList from "./SampleContractsList";

const IndexCanvas = () => {
  const [block, setBlock] = useState(0);
  const [lastBlockHash, setLastBlockHash] = useState("");
  const [blockchainUrl, setBlockchainUrl] = useState("");
  const [blockchainName, setBlockchainName] = useState("");

  const [actingChain, setActingChain] = useState("");
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAddress, setActingAddress] = useState("");
  const [api, setApi] = useState<any>();

  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  
  const [result, setResult] = useState("");
  const [gasConsumed, setGasConsumed] = useState("");
  const [outcome, setOutcome] = useState("");
  
  const [tokenJson, setTokenJson] = useState("");
  const [tokenImageUri, setTokenImageUri] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [subScanUri, setSubScanUri] = useState("");
  const [subScanTitle, setSubScanTitle] = useState("");

  let subScanBaseUri = "";

/*
  const extensionSetup = async () => {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("Polk4NET");
    if (extensions.length === 0) {
      return;
    }
    const account = await web3Accounts();
    setAccounts(account);
  };
*/

useEffect(() => {
//    setup();
  });
  
  async function getTokenURI() {
    if (!blockchainUrl || !block) {
      alert("Please select Blockchain and click 'Set Blockchain' button.");
      return;
    }
    const gasLimit = 3000 * 1000000;
    const contract = new ContractPromise(api, abi, contractAddress);
    const {gasConsumed, result, output} = 
      await contract.query.tokenUri(
        contractAddress,
        {value: 0, gasLimit: -1},
        {u64: tokenId});
    
    setResult(JSON.stringify(result.toHuman()));
    console.log(gasConsumed.toHuman().toString());
    console.log(result);

    const url = output?.toHuman()?.toString();
    if (url !== undefined) {
      setOutcome(url);
      axios.get(url).then(res => {
        setTokenJson(res.data.image.toString());
        setTokenImageUri(res.data.image.toString());
        setTokenName(res.data.name.toString());
        setTokenDescription(res.data.description.toString());
      });
    }

    if (blockchainUrl == "wss://shiden.api.onfinality.io/public-ws") {
      subScanBaseUri = "https://shiden.subscan.io/account/";
      setSubScanUri(subScanBaseUri + contractAddress);
      setSubScanTitle("Show on Subscan (Shiden)");
    } else if (blockchainUrl == "wss://rpc.shibuya.astar.network") {
      subScanBaseUri = "https://shibuya.subscan.io/account/";
      setSubScanUri(subScanBaseUri + contractAddress);
      setSubScanTitle("Show on Subscan (Shibuya)");
    } else {
      setSubScanTitle("");
    }

    getOwnerOf();
  };

  async function getOwnerOf() {
    const gasLimit = 3000 * 1000000;

    const contract = new ContractPromise(api, abi, contractAddress);
    const {gasConsumed, result, output} = 
      await contract.query.ownerOf(
        contractAddress,
        {value: 0, gasLimit: -1},
        {u64: tokenId});
    
    const resultStr: string = output?.toHuman()?.toString()!; 
    if (resultStr) {
      setOwnerAddress(resultStr);
    } else {
      setOwnerAddress('none');
    }

  };

  const setup = async () => {
    if (!blockchainUrl) {
      return;
    }
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({provider: wsProvider});
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
      setBlock(lastHeader.number.toNumber());
      setLastBlockHash(lastHeader.hash.toString());
    });
    setApi(api);
    setActingChain(blockchainUrl);
  };

  return (
    <div className="text-center">
      <Header />
      <div className="p-3 mt-2 m-auto w-11/12 border-[#323943] bg-[#121923] border border-1 rounded">
        <div className="mb-5 text-xl">Select blockchain</div>
        <button
          className="bg-[#184e9b] hover:bg-[#1964cf] text-white rounded px-4 py-2"
          onClick={setup}
        >
          Set Blockchain
        </button>
        <select
          className="p-3 m-3 mt-0 bg-[#020913] border-2 border-gray-300 rounded"
          onChange={(event) => {
            console.log(event);
            setBlockchainUrl((event.target.value));
          }}
        >
            <option key="none" value="">-- select --</option>
            <option key="shiden" value="wss://shiden.api.onfinality.io/public-ws">Shiden</option>
            <option key="shibuya" value="wss://rpc.shibuya.astar.network">Shibuya</option>
            <option key="local" value="ws://127.0.0.1:9944">Local</option>
            <option key="custom" value="wss://astar-collator.cielo.works:11443">Custom</option>
        </select>

        <div className="p-2 m-2 mt-0">Current Blockchain URL: {actingChain? actingChain : "---"}</div>
        <div className="p-1 m-1">Block: {block? block : "---"}</div>
        <div className="p-1 m-auto w-11/12 break-all">Last block hash: {lastBlockHash? lastBlockHash : "---"}</div>
      </div>

      <div className="text-center mt-5">
        <select
          className="p-3 m-3 bg-[#020913] border-2 border-gray-300 rounded hidden"
          onChange={(event) => {
            console.log(event);
            setActingAddress(event.target.value);
          }}
        >
          {accounts.map((a) => (
            <option key={a.address} value={a.address}>
              [{a.meta.name}]
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mt-5">
        <button disabled={!contractAddress || !tokenId}
          className="bg-[#184e9b] hover:bg-[#1964cf] disabled:bg-stone-700 text-white rounded px-4 py-2"
          onClick={getTokenURI}
        >{contractAddress || tokenId ? 'View NFT' : 'Enter Blank Form'}</button>
        <input
          className="p-2 m-2 bg-[#020913] border-2 border-gray-300 rounded"
          onChange={(event) => setContractAddress(event.target.value)}
          placeholder="ContractAddress"
        />
        <input
          className="p-2 m-2 w-20 bg-[#020913] border-2 border-gray-300 rounded"
          onChange={(event) => setTokenId(event.target.value)}
          placeholder="TokenID"
        />
      </div>

      <div className="text-center">
        <div>
          <img className="p-2 m-auto w-64" src={tokenImageUri} />
          <p className="p-1 m-1 text-xl break-words">{tokenName}</p>
          <p className="p-1 m-1 break-words">{tokenDescription}</p>
          <p className={contractAddress ? "m-1 break-all" : "hidden"}><a target="_blank" rel="noreferrer" href={subScanUri}>{subScanTitle}</a></p>
        </div>
      </div>

      <div className="text-left p-2 mt-5 m-auto w-11/12 border-[#323943] bg-[#121923] border border-1 rounded">
        <p className="p-1 m-1 break-all">MetadataUri: {outcome}</p>
        <p className="p-1 m-1 break-all" >ImageUri: {tokenJson}</p>
        <p className="p-1 m-1">TokenId: {tokenId}</p>
        <p className="p-1 m-1 break-all">OwnerAddress: {ownerAddress}</p>
      </div>
      <SampleContractsList />
      <Footer />
    </div>
  );
};

export default IndexCanvas;