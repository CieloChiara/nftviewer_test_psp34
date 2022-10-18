import { useEffect, useState } from "react";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ContractPromise } from '@polkadot/api-contract';
import abi from './metadata.json';
import axios from "axios";
import { render } from "react-dom";

import type { Bytes, Compact, DoNotConstruct, Enum, Int, Null, Option, Struct, U8aFixed, UInt, Vec, u16, u32, u64, u8 } from '@polkadot/types-codec';
//import { formatNumber, numberToU8a, hexToU8a, isHex, u8aToString, stringToU8a } from '@polkadot/util';
import { BN } from '@polkadot/util';

const Home = () => {
  const subScanBaseUri = "https://shibuya.subscan.io/account/";

  const [block, setBlock] = useState(0);
  const [lastBlockHash, setLastBlockHash] = useState("");
  //const [blockchainUrl, setBlockchainUrl] = useState("wss://rpc.shibuya.astar.network");
  const [blockchainUrl, setBlockchainUrl] = useState("wss://shiden.api.onfinality.io/public-ws");
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
  const [subScanUri, setSubScanUri] = useState(subScanBaseUri);
  const [subScanTitle, setSubScanTitle] = useState("");

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

  useEffect(() => {
//    setup();
  });
  
  async function getTokenURI() {

    const BN = require('bn.js');
    const tmp: u8 = new BN(parseInt(tokenId), 10).u8;

    const gasLimit = 3000 * 1000000;
    const contract = new ContractPromise(api, abi, contractAddress);
    const {gasConsumed, result, output} = 
      await contract.query.tokenUri(contractAddress, {value: 0, gasLimit: -1}, tmp);
    
    setGasConsumed(gasConsumed.toHuman().toString());
    setResult(JSON.stringify(result.toHuman()));

    setOutcome(output.toHuman().toString());
    const url = output.toHuman().toString();

    axios.get(url).then(res => {
      setTokenJson(res.data.image.toString());
      setTokenImageUri(res.data.image.toString());
      setTokenName(res.data.name.toString());
    });

    setSubScanUri(subScanBaseUri + contractAddress);
    if (blockchainUrl == "wss://shiden.api.onfinality.io/public-ws") {
      setSubScanTitle("Show on Subscan (Shiden)");
    } else if (blockchainUrl == "wss://rpc.shibuya.astar.network") {
      setSubScanTitle("Show on Subscan (Shibuya)");
    } else {
      setSubScanTitle("");
    }

    //getOwnerOf();
  };

  async function getOwnerOf() {
    const gasLimit = 3000 * 1000000;

    const BN = require('bn.js');
    const tmp: u32 = new BN(parseInt(tokenId), 10).u32;

    const contract = new ContractPromise(api, abi, contractAddress);
    const {gasConsumed, result, output} = 
      //await contract.query['psp34::ownerOf'](
      await contract.query.ownerOf(
          contractAddress,
        {value: 0, gasLimit: -1},
        tmp);
    
    const resultStr: string = output.toHuman()?.toString(); 
        //setOutcome(output.toHuman().toString());
    if (resultStr) {
      setOwnerAddress(resultStr);
    } else {
      setOwnerAddress('none');
    }
    //const url = output.toHuman().toString();
  };

  const setup = async () => {
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
      setBlock(lastHeader.number.toNumber());
      setLastBlockHash(lastHeader.hash.toString());
    });
    setApi(api);
    setActingChain(blockchainUrl);
    //await extensionSetup();
    //setContractAddress('W2i3x5RUvxH1AiYvzZsHKqaV4PCZ9M3DP8EjQkSmXqTJcRQ');    
  };

  return (
    <>
      <div className="text-center">
        <div className="p-3 m-3 text-3xl">NFTViewer Test</div>

        <div className="p-3 mt-5 m-auto border-1 w-11/12 border border-gray-500">
          <div className="p-2 mb-0 text-xl">Select blockchain</div>
          <button
            className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
            onClick={setup}
          >
            Set Blockchain
          </button>
          <select
            className="p-3 m-3 mt-0 border-2 border-green-500"
            onChange={(event) => {
              console.log(event);
              setBlockchainUrl((event.target.value));
            }}
          >
              <option key="Shiden" value="wss://shiden.api.onfinality.io/public-ws">Shiden</option>
              <option key="wss://rpc.shibuya.astar.network" value="wss://rpc.shibuya.astar.network">Shibuya</option>
              <option key="ws://127.0.0.1:9944" value="ws://127.0.0.1:9944">Local</option>
              <option key="wss://astar-collator.cielo.works:11443" value="wss://astar-collator.cielo.works:11443">Custom</option>
          </select>

          <div className="p-2 m-2">Current Blockchain URL: {actingChain? actingChain : "---"}</div>
          <div className="p-1 m-1">Block: {block? block : "---"}</div>
          <div className="p-1 m-auto w-11/12 break-all">Last block hash: {lastBlockHash? actingChain : "---"}</div>
        </div>

        <select
          className="p-3 m-3 border-2 border-green-500 hidden"
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
            className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
            onClick={getTokenURI}
          >{contractAddress || tokenId ? 'View NFT' : 'Enter Blank Form'}</button>
          <input
            className="p-2 m-2 border-2"
            onChange={(event) => setContractAddress(event.target.value)}
            placeholder="ContractAddress"
          />
          <input
            className="p-2 m-2 border-2 w-20"
            onChange={(event) => setTokenId(event.target.value)}
            placeholder="TokenID"
          />
        </div>

        <div className="text-center">
          <div>
            <img className="p-2 m-auto w-64" src={tokenImageUri}></img>
            <p className="p-1 m-1 text-xl">{tokenName}</p>
            <p className={contractAddress ? "m-1" : "hidden"}><a target="_blank" rel="noreferrer" href={subScanUri}>{subScanTitle}</a></p>
          </div>
        </div>

        <div className="p-2 mt-5 m-auto border-1 w-11/12 border border-gray-500">
          <div className="hidden p-3 m-3">TokenURI: {tokenURI}</div>
          <p className="p-1 m-1 hidden">Result: {result}</p>
          <p className="p-1 m-1 break-all">MetadataUri: {outcome}</p>
          <p className="p-1 m-1 hidden">Gas consumed: {gasConsumed}</p>
          <p className="p-1 m-1 break-all" >ImageUri: {tokenJson}</p>
          <p className="p-1 m-1">TokenId: {tokenId}</p>
          <p className="p-1 m-1">OwnerAddress: {ownerAddress}</p>
        </div>
        <div className="p-2 m-auto mb-5 border-1 w-11/12 border border-gray-500">
          <h3 className="m-1 text-xl text-center">Contracts (Shibuya)</h3>
          <p className="m-1 break-all">CieloNFT: Z4yPLMW1mHEDtb7vhpE4D62q68GWxw3cRpzrX8gvNGHQUG1</p>
          <p className="m-1 break-all">PiyoNFT: YSnt4PAS2L9XYsvygoecQvMGAJo3CuYN5ZYtJiFKnxtq1sz</p>
          <h3 className="m-1 text-xl text-center">Contracts (My LocalCollator)</h3>
          <p className="m-1 break-all">CieloNFT: W2i3x5RUvxH1AiYvzZsHKqaV4PCZ9M3DP8EjQkSmXqTJcRQ</p>
          <p className="m-1 break-all">PiyoNFT: ZBkjgPFu1QqbcRjjfyb1wjLondbsT96ypPxdn226KnusZdv</p>
        </div>
    </>
  );
};


export default Home;