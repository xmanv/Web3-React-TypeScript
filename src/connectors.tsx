import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
// import { LedgerConnector } from "@web3-react/ledger-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";
import { AuthereumConnector } from "@web3-react/authereum-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const supportedNetworkURLs = {
  1: "https://mainnet.infura.io/v3/3c9b697bcf414df8b2e59f7f5523a93a",
  4: "https://rinkeby.infura.io/v3/3c9b697bcf414df8b2e59f7f5523a93a"
};

const defaultNetwork = 1;

const Injected = () =>
  new InjectedConnector({
    supportedChainIds: [1, 4]
  });

const Walletlink = () =>
  new WalletLinkConnector({
    url: supportedNetworkURLs[1],
    appName: "Unknown"
  });

const Authereum = () => new AuthereumConnector({ chainId: defaultNetwork });

const Network = () =>
  new NetworkConnector({
    urls: supportedNetworkURLs,
    defaultChainId: defaultNetwork
  });

const Trezor = () =>
  new TrezorConnector({
    // api: TrezorApi,
    supportedNetworkURLs,
    defaultNetwork,
    manifestEmail: "noahwz@gmail.com",
    manifestAppUrl: "https://codesandbox.io/s/r7wymqkzwn"
  });

// const Ledger = () => new LedgerConnector({
//   supportedNetworkURLs,
//   defaultNetwork
// });

const WalletConnect = () =>
  new WalletConnectConnector({
    rpc: { 1: supportedNetworkURLs[1] },
    bridge: "https://bridge.walletconnect.org",
    // supportedNetworkURLs,
    qrcode: true
  });

const Fortmatic = () =>
  new FortmaticConnector({
    // api: FortmaticApi,
    apiKey: "pk_live_F95FEECB1BE324B5",
    chainId: 1
  });

const Portis = () =>
  new PortisConnector({
    // api: PortisApi,
    dAppId: "211b48db-e8cc-4b68-82ad-bf781727ea9e",
    networks: [1]
  });

export default {
  Injected,
  Network,
  Trezor,
  // Ledger,
  WalletConnect,
  Fortmatic,
  Portis,
  Walletlink,
  Authereum
};
