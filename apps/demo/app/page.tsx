import { appConfig, isConfigurationValid } from './config'
import IntegrityClient from '../components/IntegrityClient'
import fs from 'fs'
import { json } from 'starknet'

export default function HomePage() {
  if (!isConfigurationValid) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 text-red-600 bg-red-100 border border-red-400 rounded-lg">
          Configuration is invalid. Please check your environment variables.
        </div>
      </div>
    )
  }

  const compiledContract = json.parse(fs.readFileSync(appConfig.sierraFilePath!).toString('ascii'))
  const abi = compiledContract.abi

  const integrityConfig = {
    contractAddress: appConfig.contractAddress!,
    rpcUrl: appConfig.rpcUrl!,
    relayerAddress: appConfig.relayerAddress!,
    relayerPrivateKey: appConfig.relayerPrivateKey!,
    abi: abi
  }

  return <IntegrityClient {...integrityConfig} />
}
