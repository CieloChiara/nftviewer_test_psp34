import { useEffect, useState } from "react";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ContractPromise } from '@polkadot/api-contract';
import abi from './metadata_type_u32.json';
import axios from "axios";
import { render } from "react-dom";
import {
  web3Accounts,
  web3Enable,
  web3AccountsSubscribe,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider,
  web3FromSource
} from '@polkadot/extension-dapp';

const Home = () => {
  const subScanBaseUri = "https://shibuya.subscan.io/account/";

  const [block, setBlock] = useState(0);
  const [lastBlockHash, setLastBlockHash] = useState("");
  const [blockchainUrl, setBlockchainUrl] = useState("wss://shiden.api.onfinality.io/public-ws");
  const [blockchainName, setBlockchainName] = useState("");

  const [actingChain, setActingChain] = useState("");
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
  const [subScanUri, setSubScanUri] = useState(subScanBaseUri);
  const [subScanTitle, setSubScanTitle] = useState("");

  const gasLimit = 18750000000;
  const storageDepositLimit = null;

  const extensionSetup = async () => {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("Showcase PSP34 Test");
    if (extensions.length === 0) {
      return;
    }
    const account = await web3Accounts();
    setAccounts(account);
  };

  useEffect(() => {
//    setup();
  });

  async function execMint() {

    const gasLimit = 30000 * 1000000;
    const value = 0;

    const contract = new ContractPromise(api, abi, contractAddress);

    const extensions = await web3Enable("Showcase PSP34 Test");
    console.log(accounts);

    const mintTokenExtrinsic =
      await contract.tx.mintToken({gasLimit}, accounts[0].address);
    const injector = await web3FromSource(accounts[0].meta.source);
    
    setTokenURI(tokenId);
    //setGasConsumed(gasConsumed.toHuman().toString());
    //setResult(JSON.stringify(result.toHuman()));

    //setOutcome(output.toHuman().toString());
    //const url = output.toHuman().toString();

    mintTokenExtrinsic.signAndSend(accounts[0].address, { signer: injector.signer }, ({ status }) => {
      if (status.isInBlock) {
        console.log(`Completed at block hash #${status.asInBlock.toString()}`);
        setGasConsumed(status.asInBlock.toString());
      } else {
        console.log(`Current status: ${status.type}`);
        setGasConsumed(status.type.toString());
      }
    }).catch((error: any) => {
      console.log(':( transaction failed', error);
      setGasConsumed(error.toString());
    });

    setSubScanUri(subScanBaseUri + contractAddress);
    if (blockchainUrl == "wss://shiden.api.onfinality.io/public-ws") {
      setSubScanTitle("Show on Subscan (Shiden)");
    } else if (blockchainUrl == "wss://rpc.shibuya.astar.network") {
      setSubScanTitle("Show on Subscan (Shibuya)");
    } else {
      setSubScanTitle("");
    }

  
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
        <div className="p-3 m-3 text-3xl">NFTMint Test</div>

        <div className="p-3 mt-5 m-auto border-1 w-11/12 border border-gray-500 rounded">
          <div className="p-2 mb-0 text-xl">Select blockchain</div>
          <button
            className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
            onClick={setup}
          >
            Set Blockchain
          </button>
          <select
            className="p-3 m-3 mt-0 border-2 border-green-500 rounded"
            onChange={(event) => {
              console.log(event);
              setBlockchainUrl((event.target.value));
            }}
          >
              <option key="None" value="">-- select --</option>
              <option key="Shiden" value="wss://shiden.api.onfinality.io/public-ws">Shiden</option>
              <option key="Shibuya" value="wss://rpc.shibuya.astar.network">Shibuya</option>
              <option key="Local" value="ws://127.0.0.1:9944">Local</option>
              <option key="Custom" value="wss://astar-collator.cielo.works:11443">Custom</option>
          </select>

          <div className="p-2 m-2">Current Blockchain URL: {actingChain? actingChain : "---"}</div>
          <div className="p-1 m-1">Block: {block? block : "---"}</div>
          <div className="p-1 m-auto w-11/12 break-all">Last block hash: {lastBlockHash? lastBlockHash : "---"}</div>
        </div>

        <button
            className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
            onClick={extensionSetup}
          >
            Set Account
        </button>
        <select
          className="p-3 m-3 border-2 border-green-500 rounded"
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
          <button disabled={!contractAddress}
            className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
            onClick={execMint}
          >{contractAddress ? 'Mint NFT' : 'Enter ContractAddress'}</button>
          <input
            className="p-2 m-2 border-2 w-64 rounded"
            onChange={(event) => setContractAddress(event.target.value)}
            placeholder="ContractAddress"
          />
        </div>

        <div className="text-center">
          <div>
            <img className="p-2 m-auto w-64" src={tokenImageUri}></img>
            <p className="p-1 m-1 text-xl">{tokenName}</p>
            <p className={contractAddress ? "m-1" : "hidden"}><a target="_blank" rel="noreferrer" href={subScanUri}>{subScanTitle}</a></p>
          </div>
        </div>

        <div className="p-2 mt-5 m-auto border-1 w-11/12 border border-gray-500 rounded">
          <div className="hidden p-3 m-3">TokenURI: {tokenURI}</div>
          <p className="p-1 m-1 hidden">Result: {result}</p>
          <p className="p-1 m-1 break-all">MetadataUri: {outcome}</p>
          <p className="p-1 m-1 hidden">Gas consumed: {gasConsumed}</p>
          <p className="p-1 m-1 break-all" >ImageUri: {tokenJson}</p>
          <p className="p-1 m-1">TokenId: {tokenId}</p>
          <p className="p-1 m-1">actingAddress: {actingAddress}</p>
        </div>
        <div className="p-2 m-auto mb-5 border-1 w-11/12 border border-gray-500 rounded">
          <h3 className="m-1 text-xl text-center">Contracts (Shibuya)</h3>
          <p className="m-1 break-all">CieloNFT: a1YGBqnLkLYkW3QfGWGn7XVQMGurxY5R9yYBTv8RHa537e1</p>
          <p className="m-1 break-all">PiyoNFT: Y1GKyffZjEbQghjoABVhLLenkr94nW6qpk5b5kCTw6wvBP9</p>
          <h3 className="m-1 text-xl text-center">Contracts (My LocalCollator)</h3>
          <p className="m-1 break-all">CieloNFT: bKF9cww361bvu2qwf9hy22WM3m4Md58qukaHQxt8F5SvdxZ</p>
          <p className="m-1 break-all">PiyoNFT: axjrMcZeFnZ1rbRHJX3HQaF5QEu2BRJPFwxiqyoWHsuDHZj</p>
          <h3 className="m-1 text-xl text-center">Contracts (Local)</h3>
          <p className="m-1 break-all">PiyoNFT(u32): 5H2mY8Gs9UjLBw3FCwzmZQSGuVDVj4vyyCFEpashtwf8MVPh</p>
        </div>
    </>
  );
};


export default Home;