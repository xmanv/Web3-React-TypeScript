import  React,{useEffect}from "react";
import { render } from "react-dom";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { JsonRpcSigner as Signer } from "@ethersproject/providers";
import {utf8ToHex} from "web3-utils";

import { ethers } from "ethers";

import * as connectors from "./connectors";
import "./styles.css";

async function signMessage(signer: Signer) {
  const message = "Message to sign";

  const signature = await signer.signMessage(message);
  console.log("signature", signature);
  return signature;
}

async function signPersonalMessage(signer: Signer) {
  const message = "Message to sign";

  const provider = signer.provider;

  const address = await signer.getAddress();

  console.log("Signing address", address);

  const signature = await provider.send("personal_sign", [message, address]);
  console.log("signature", signature);
  return signature;
}

async function signTypedData(signer: Signer) {
  // All properties on a domain are optional
  const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
  };

  // The named list of all type definitions
  const types = {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" }
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" }
    ]
  };

  // The data to sign
  const value = {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
    },
    contents: "Hello, Bob!"
  };

  const signature = await signer._signTypedData(domain, types, value);

  console.log("signature", signature);

  return signature;
}

async function sendTransaction(signer: Signer) {
  const { hash } = await signer.sendTransaction({
    to: ethers.constants.AddressZero,
    value: 0
  });

  return hash;
}

function MyComponent() {
  const context = useWeb3React<ethers.providers.Web3Provider>();

  console.log(context);

  if (context.error) {
    console.error("Error!", context.error);
  }

  const [transactionHash, setTransactionHash] = React.useState("");

  const [signature, setSignature] = React.useState("");

  const [error, setError] = React.useState<Error | null>(null);

  const wrapSignFunc = (
    signF: (signer: Signer) => Promise<string>,
    setResult: (res: string) => void
  ) => async () => {
    setError(null);
    setResult("");
    try {
      const result = await signF(context.library.getSigner());
      setResult(result);
    } catch (error) {
      console.error("Provider Error", error);
      setError(error);
      setResult("");
    }
  };
  useEffect(()=>{
   (async()=>{
      if(context.library){
        const signature= await signPersonalMessage(context.library.getSigner())
        setSignature(signature)
      }
    })()
  },[context.library])

  return (
    <React.Fragment>
      <h1>web3-react Demo</h1>

      <Web3ConsumerComponent />

      {context.error && (
        <>
          <p>An error occurred, check the console for details.</p>
          <pre>{context.error.message || context.error}</pre>
        </>
      )}

      {Object.keys(connectors).map((connectorName) => (
        <button
          key={connectorName}
          disabled={context.connector === connectors[connectorName]}
          onClick={() => context.activate(connectors[connectorName]())}
        >
          {context.library?'persinsing':'Activate'} {connectorName}
        </button>
      ))}

      <br />


      {context.active && context.account && !transactionHash && (
        <button onClick={wrapSignFunc(sendTransaction, setTransactionHash)}>
          Send Dummy Transaction
        </button>
      )}

      {transactionHash && <p>txHash: {transactionHash}</p>}

      {context.active && context.account && (
        <button onClick={wrapSignFunc(signTypedData, setSignature)}>
          Sign Typed Data
        </button>
      )}

      {context.active && context.account && (
        <button onClick={wrapSignFunc(signMessage, setSignature)}>
          Sign Message
        </button>
      )}

      {context.active && context.account && (
        <button onClick={wrapSignFunc(signPersonalMessage, setSignature)}>
          Sign Personal Message
        </button>
      )}

      {signature && <p>Signature: {signature}</p>}

      {error && (
        <>
          <p>Provider error</p>
          <pre>{error.message || error}</pre>
        </>
      )}
    </React.Fragment>
  );
}

function Web3ConsumerComponent() {
  const context = useWeb3React<ethers.providers.Web3Provider>();
  const { connector, account, chainId } = context;
  const connectorName =
    connector &&
    Object.keys(connectors).find((key) => connectors[key] === connector);
  return (
    <React.Fragment>
      <p>Active Connector: {connectorName}</p>
      <p>Account: {account || "None"}</p>
      <p>Network ID: {chainId}</p>
    </React.Fragment>
  );
}


function App() {
  return (
    <Web3ReactProvider
      getLibrary={(prov) => new ethers.providers.Web3Provider(prov)}
    >
      <div className="App">
        <MyComponent />
      </div>
    </Web3ReactProvider>
  );
}




export default App;
