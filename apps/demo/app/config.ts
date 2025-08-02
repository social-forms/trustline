export const appConfig = {
  contractAddress: process.env.CONTRACT_ADDRESS,
  rpcUrl: process.env.RPC_URL,
  relayerAddress: process.env.RELAYER_ADDRESS,
  relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY,
  sierraFilePath: process.env.SIERRA_FILE_PATH
}

export const isConfigurationValid =
  !!appConfig.contractAddress &&
  !!appConfig.rpcUrl &&
  !!appConfig.relayerAddress &&
  !!appConfig.relayerPrivateKey &&
  !!appConfig.sierraFilePath
