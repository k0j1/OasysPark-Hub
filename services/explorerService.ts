import { ChainType, NFT, Token } from "../types";

const EXPLORER_API_URL = "https://explorer.oasys.games/api";

interface ExplorerToken {
  balance: string;
  contractAddress: string;
  decimals: string;
  name: string;
  symbol: string;
  type: string; // "ERC-20", "ERC-721", "ERC-1155"
}

interface ExplorerResponse<T> {
  message: string;
  result: T;
  status: string;
}

// Helper to format balance from Wei
const formatBalance = (balance: string, decimals: string | number): string => {
  try {
    const val = BigInt(balance);
    const div = BigInt(10) ** BigInt(decimals);
    const integer = val / div;
    const remainder = val % div;
    
    // Show up to 2 decimal places for simplicity
    const decimalPart = remainder.toString().padStart(Number(decimals), '0').substring(0, 2);
    return `${integer}.${decimalPart}`;
  } catch (e) {
    return "0.00";
  }
};

export const fetchOasysAssets = async (address: string) => {
  try {
    // 1. Fetch Native OAS Balance
    const balanceRes = await fetch(`${EXPLORER_API_URL}?module=account&action=balance&address=${address}`);
    const balanceData: ExplorerResponse<string> = await balanceRes.json();
    const nativeBalanceWei = balanceData.status === "1" ? balanceData.result : "0";
    const nativeBalance = formatBalance(nativeBalanceWei, 18);

    // 2. Fetch Token List (ERC-20, 721, 1155)
    const tokensRes = await fetch(`${EXPLORER_API_URL}?module=account&action=tokenlist&address=${address}`);
    const tokensData: ExplorerResponse<ExplorerToken[]> = await tokensRes.json();
    
    const rawTokens = tokensData.status === "1" ? tokensData.result : [];

    const tokens: Token[] = [];
    const nfts: NFT[] = [];

    // Add Native Token manually to the list
    tokens.push({
      symbol: "OAS",
      name: "Oasys Native Token",
      balance: nativeBalance,
      decimals: "18",
      priceUsd: 0.085, // Mock price for display
      change24h: 0,
      chain: ChainType.OASYS_MAINNET,
      icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/22265.png"
    });

    rawTokens.forEach((t, index) => {
      if (t.type === "ERC-20") {
        tokens.push({
          symbol: t.symbol,
          name: t.name,
          balance: formatBalance(t.balance, t.decimals),
          decimals: t.decimals,
          contractAddress: t.contractAddress,
          priceUsd: 0, // Unknown price from Explorer
          change24h: 0,
          chain: ChainType.OASYS_MAINNET,
        });
      } else if (t.type === "ERC-721" || t.type === "ERC-1155") {
        // For NFTs, explorer 'tokenlist' often returns balance (quantity) per contract
        // It does not always return individual metadata in this endpoint.
        nfts.push({
          id: `${t.contractAddress}-${index}`,
          collectionName: t.name || "Unknown Collection",
          contractAddress: t.contractAddress,
          balance: t.balance, // Quantity owned
          imageUrl: `https://picsum.photos/seed/${t.contractAddress}/200/200`, // Placeholder as API doesn't provide image
          chain: ChainType.OASYS_MAINNET,
          type: t.type as 'ERC-721' | 'ERC-1155'
        });
      }
    });

    return {
      nativeBalance,
      tokens,
      nfts
    };

  } catch (error) {
    console.error("Failed to fetch Oasys assets:", error);
    // Return empty/zero state on failure
    return {
      nativeBalance: "0.00",
      tokens: [],
      nfts: []
    };
  }
};
