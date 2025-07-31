// apps/demo/app/config.ts
export const appConfig = {
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
};

export const isConfigurationValid = 
  appConfig.contractAddress && appConfig.rpcUrl;
