import { useEffect, useState } from "react";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ContractPromise } from '@polkadot/api-contract';
import abi from './metadata.json';
import axios from "axios";
import { render } from "react-dom";

const Home = () => {
  const [block, setBlock] = useState(0);
  const [lastBlockHash, setLastBlockHash] = useState("");
  const [blockchainUrl, setBlockchainUrl] = useState("wss://rpc.shibuya.astar.network");
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAddress, setActingAddress] = useState("");
  const [api, setApi] = useState<any>();

  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  const [result, setResult] = useState("");
  const [gasConsumed, setGasConsumed] = useState("");
  const [outcome, setOutcome] = useState("");
  
  const [tokenJson, setTokenJson] = useState("");
  const [tokenImageUri, setTokenImageUri] = useState("");
  const [tokenName, setTokenName] = useState("");

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
    setup();
  });

  async function getTokenURI() {
    const gasLimit = 3000 * 1000000;
    const value = 0;
    if (contractAddress == "") {
      
    }
    const contract = new ContractPromise(api, abi, contractAddress);
    const {gasConsumed, result, output} = 
      await contract.query.tokenUri(contractAddress, {value: 0, gasLimit: -1}, 0);
    
    setTokenURI(tokenId);
    setGasConsumed(gasConsumed.toHuman().toString());
    setResult(JSON.stringify(result.toHuman()));

    setOutcome(output.toHuman().toString());
    const url = output.toHuman().toString();

    axios.get(url).then(res => {
      setTokenJson(res.data.image.toString());
      setTokenImageUri(res.data.image.toString());
      setTokenName(res.data.name.toString());
    });

  };

  const setup = async () => {
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
      setBlock(lastHeader.number.toNumber());
      setLastBlockHash(lastHeader.hash.toString());
    });
    setApi(api);
    await extensionSetup();
    //setContractAddress('a1YGBqnLkLYkW3QfGWGn7XVQMGurxY5R9yYBTv8RHa537e1');    
  };

  return (
    <>
      <div className="text-center">
        <div className="p-3 m-3 text-3xl">NFTViewer Test</div>
        <div className="p-1 m-1">Block: {block}</div>
        <div className="p-2 m-2 text-xl">Blockchain URL: {blockchainUrl}</div>
        <div className="p-1 m-1">Custom Blockchain URL (Testlocal: wss://astar-collator.cielo.works:11443)</div>
        <button
          className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
          onClick={setup}
        >
          Change Blockchain URL
        </button>
        <input
          className="p-2 m-2 border-2"
          onChange={(event) => setBlockchainUrl(event.target.value)}
        />
        <div className="p-1 m-1 hidden">Last block hash: {lastBlockHash}</div>
        <div>
        <select
          className="p-3 m-3 border-2 border-green-500"
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

        <p className="m-1"><a target="_blank" rel="noreferrer" href="https://shibuya.subscan.io/account/a1YGBqnLkLYkW3QfGWGn7XVQMGurxY5R9yYBTv8RHa537e1">Show on Subscan</a></p>
        <button disabled={!api || !contractAddress || !tokenId }
          className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
          onClick={getTokenURI}
        >{api && contractAddress && tokenId ? 'View NFT' : 'Loding..'}</button>
        <input
          className="p-2 m-2 border-2"
          onChange={(event) => setContractAddress(event.target.value)}
          placeholder="ContractAddress"
        />
        <input
          className="p-2 m-2 border-2  w-20"
          onChange={(event) => setTokenId(event.target.value)}
          placeholder="TokenID"
        />
        <div className="flex justify-center">
          <div>
            <img className="p-2 m-2 w-64" src={tokenImageUri}></img>
            <p className="p-1 m-1 text-xl">{tokenName}</p>
          </div>
        </div>
        <div className="p-2 m-auto border-1 w-11/12 border border-gray-500">
          <div className="hidden p-3 m-3">TokenURI: {tokenURI}</div>
          <p className="p-1 m-1 hidden">Result: {result}</p>
          <p className="p-1 m-1 break-all">MetadataUri: {outcome}</p>
          <p className="p-1 m-1 hidden">Gas consumed: {gasConsumed}</p>
          <p className="p-1 m-1 break-all" >ImageUri: {tokenJson}</p>
        </div>
        <div className="p-2 m-auto border-1 w-11/12 border border-gray-500">
          <p className="m-1 break-all">(Cielo sby: a1YGBqnLkLYkW3QfGWGn7XVQMGurxY5R9yYBTv8RHa537e1)</p>
          <p className="m-1 break-all">(Piyo sby: Y1GKyffZjEbQghjoABVhLLenkr94nW6qpk5b5kCTw6wvBP9)</p>
          <p className="m-1 break-all">(Cielo local: bKF9cww361bvu2qwf9hy22WM3m4Md58qukaHQxt8F5SvdxZ)</p>
          <p className="m-1 break-all">(Piyo local: b1nAeT4AL3N9T6cXiTWjwsJmT4xAvTtcW4mqzy7pA1vwDUY)</p>
        </div>
      </div>
    </>
  );
};


export default Home;