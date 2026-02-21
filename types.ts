import { LucideIcon } from 'lucide-react';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GAMES = 'GAMES',
  ASSETS = 'ASSETS',
}

export enum ChainType {
  OASYS_MAINNET = 'Oasys Mainnet',
  HOME_VERSE = 'Home Verse',
  TCG_VERSE = 'TCG Verse',
  MCH_VERSE = 'MCH Verse',
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  chain: ChainType;
  imageUrl: string;
  link?: string;
  tags: string[];
  isHot?: boolean;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  decimals: string;
  contractAddress?: string;
  priceUsd: number; // API doesn't return this, handled locally or mocked
  change24h: number; // API doesn't return this
  chain: ChainType;
  icon?: string;
}

export interface NFT {
  id: string; // contract address + unique index
  collectionName: string;
  contractAddress: string;
  balance: string; // Quantity owned
  tokenId?: string; // Specific ID if available
  imageUrl: string;
  chain: ChainType;
  type: 'ERC-721' | 'ERC-1155';
}

export enum WalletConnectionMethod {
  METAMASK = 'METAMASK',
  FARCASTER = 'FARCASTER',
  MANUAL = 'MANUAL',
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
  connectionMethod: WalletConnectionMethod | null;
  farcasterUser?: {
    fid: number;
    username: string;
    displayName: string;
  };
  tokens: Token[];
  nfts: NFT[];
  isLoadingAssets: boolean;
}

export interface NavItem {
  id: ViewState;
  label: string;
  icon: LucideIcon;
}
