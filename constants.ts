import { ChainType, Game, Token, NFT } from './types';

// Theme Configuration
export const THEME = {
  colors: {
    primary: 'cyan-500',
    secondary: 'fuchsia-500',
    background: 'slate-950',
    card: 'slate-900',
    text: 'slate-100',
    muted: 'slate-400',
  }
};

// Mock Games Data
export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'My Crypto Heroes',
    description: '歴史上のヒーローを集めて育てる、世界No.1の実績を持つブロックチェーンゲーム。',
    category: 'RPG',
    chain: ChainType.MCH_VERSE,
    imageUrl: 'https://www.mycryptoheroes.net/_nuxt/img/keyvisual.146f6b2.webp',
    link: 'https://www.mycryptoheroes.net/',
    tags: ['RPG', 'Strategy', 'History'],
    isHot: true,
  },
  {
    id: '3',
    title: 'Brave Frontier Heroes',
    description: 'ブレイブフロンティアのドット絵とゲーム性を継承したブロックチェーンRPG。',
    category: 'RPG',
    chain: ChainType.HOME_VERSE,
    imageUrl: 'https://rsc.bravefrontierheroes.com/static/lp/img/top/i_top_logo_BFH_JP.png',
    link: 'https://bravefrontierheroes.com/ja',
    tags: ['RPG', 'Pixel Art'],
    isHot: true,
  },
  {
    id: '5',
    title: 'OasChoice Racing',
    description: 'Oasysチェーン上のハイスピードレーシングゲーム。NFTカーで最速を目指せ。',
    category: 'Racing',
    chain: ChainType.HOME_VERSE,
    imageUrl: 'https://picsum.photos/400/300?random=5',
    tags: ['Racing', 'Action'],
  },
];

// Mock Tokens Data
export const MOCK_TOKENS: Token[] = [
  {
    symbol: 'OAS',
    name: 'Oasys',
    balance: '1,250.00',
    decimals: '18',
    priceUsd: 0.085,
    change24h: 2.5,
    chain: ChainType.OASYS_MAINNET,
  },
  {
    symbol: 'MCHC',
    name: 'MCH Coin',
    balance: '540.20',
    decimals: '18',
    priceUsd: 0.12,
    change24h: -1.2,
    chain: ChainType.MCH_VERSE,
  },
  {
    symbol: 'TCGC',
    name: 'TCG Coin',
    balance: '3,000.00',
    decimals: '18',
    priceUsd: 0.04,
    change24h: 5.8,
    chain: ChainType.TCG_VERSE,
  }
];

// Mock NFTs Data
export const MOCK_NFTS: NFT[] = [
  {
    id: 'nft1',
    collectionName: 'My Crypto Heroes',
    tokenId: '#1024',
    imageUrl: 'https://picsum.photos/200/200?random=10',
    chain: ChainType.MCH_VERSE,
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    balance: '1',
    type: 'ERC-721',
  },
  {
    id: 'nft2',
    collectionName: 'CryptoSpells',
    tokenId: '#888',
    imageUrl: 'https://picsum.photos/200/200?random=11',
    chain: ChainType.TCG_VERSE,
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    balance: '1',
    type: 'ERC-721',
  },
  {
    id: 'nft3',
    collectionName: 'OasyGenesis',
    tokenId: '#001',
    imageUrl: 'https://picsum.photos/200/200?random=12',
    chain: ChainType.OASYS_MAINNET,
    contractAddress: '0x7890abcdef1234567890abcdef1234567890ab',
    balance: '1',
    type: 'ERC-721',
  }
];