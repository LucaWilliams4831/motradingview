export const twitterUrl = "https://www.google.com";
export const telegramUrl = "https://www.google.com";
// export const TOKEN_TOTAL_SUPPLY = 1000000000;
export const FirstQuoteReserve = 28;
export const FirstBaseReserve = 1000000;
export const LimitForRaydium = 5;
export const SolDecimal = 9;
// export const TokenDecimal = 6;
export const DecimalRatio = 3;
export const MSecondPerSecond = 1000;
export const FullPercentage = 100;
export const replyTimeForGetToken = 3000;

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const SOL_ACCOUNT_SEED = "SOL_ACCOUNT_SEED";
export const POOL_STATE_SEED = "POOL_STATE_SEED";
export const VAULT_SEED = "VAULT_SEED";

export const REACT_APP_PINATA_API_KEY = '5aadf257d81f7d8739b0';
export const REACT_APP_PINATA_SEC_KEY =
    '73b8ceb4963f8f637fcef8166bdea0166371a4dc834c29faea20eb59a9be5e4b';
export const REACT_APP_PINATA_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZDBhOGFjZC05NDY3LTQ2ZGUtOGQyNi01ODYyMjE1NmVkMzIiLCJlbWFpbCI6ImhlbGxva2NnMTExNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNWFhZGYyNTdkODFmN2Q4NzM5YjAiLCJzY29wZWRLZXlTZWNyZXQiOiI3M2I4Y2ViNDk2M2Y4ZjYzN2ZjZWY4MTY2YmRlYTAxNjYzNzFhNGRjODM0YzI5ZmFlYTIwZWI1OWE5YmU1ZTRiIiwiaWF0IjoxNzE2MDI0ODMwfQ.CdexyMQgSjFXZ6EFgkI55GRHLab1CCiMVa9uYCkEzck';
export const serverPort = 4001;
export const serverUrl = `https://65.109.107.159:${serverPort}`;
export const Init_Sol_Value_For_CreateCoin = 0.1;
export const LAMPORTS_PER_SOL = 1000000000;
export const TotalDivision = 10000;
export const estimateTrasaction = 500000;

export interface Coin {
    owner: string;
    coinName: string;
    userName: string;
    imageUrl: string;
    replyCount: number;
    marketCap: number;
    tokenAddress: string;

    // Add more properties as needed
}

export interface User {
    _id: string;
    userName: string;
    followers: string[];
    following: string[];
    // Add more properties as needed
}

export interface Reply {
    coinName: string;
    comment: string;
}
export interface Follow {
    id:string;
    name:string;
}
export interface ProfileInterface {
    _id: string;
    bio: string;
    publicKey: string;
    userName: string;
    ownedCoins: Coin[];
    heldCoins: Coin[];
    following: Follow[];
    followers: Follow[];
    replies: Reply[];
    profileImage:string;
    // Add more properties as needed
}
export interface GlobalInterface {
    marketCap: number;
    totalSupply: number;
    fee: number;
    decimal: number;
    a: number;
    b: number;
    globalSolAccount:string;
}
export const defaultProfileImage="data:image/png;base64,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"
