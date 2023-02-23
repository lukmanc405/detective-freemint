import {
  ConnectWallet,
  useAddress,
  useClaimedNFTSupply,
  useConnect,
  useContract,
  useContractRead,
  useTotalCount,
  Web3Button,
} from '@thirdweb-dev/react'
import { utils } from 'ethers'
import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const contractAddress: string = '0x1c0133a5c54b5ec1f11e6c80097a7dd3fc938b56'

  const address = useAddress()
  const [
    {
      data: { connected },
    },
  ] = useConnect()

  const [quantity, setQuantity] = useState<number>(0)
  const { contract } = useContract(contractAddress)

  const { data: price } = useContractRead(
    contract,
    'priceForAddress',
    address,
    quantity
  )

  const { data: claimedNFT, isLoading: loadingClaimed } =
    useClaimedNFTSupply(contract)
  const { data: totalCount, isLoading: loadingTotal } = useTotalCount(contract)

  const totalMint: number = claimedNFT ? claimedNFT?.toNumber() : 0
  const MAX_AMOUNT_MINT: number = totalCount ? totalCount?.toNumber() : 0

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Welcome to{' '}
          <a href="https://thirdweb.com/mumbai/0x1C0133A5c54B5Ec1F11E6c80097A7Dd3fc938B56">
            DetectiveGems Genesis Freemint!!!
          </a>
        </h3>

        <p className={styles.description}>Detective Gems, Go Brrrrr!!! </p>

        {!loadingClaimed && !loadingTotal ? (
          <p>
            {totalMint} / {MAX_AMOUNT_MINT}
          </p>
        ) : (
          <p>loading...</p>
        )}

        <div className={styles.connect}>
          <ConnectWallet />
        </div>

        <div>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </label>
        </div>

        {connected && (
          <div style={{ marginTop: '20px' }}>
            {totalMint === MAX_AMOUNT_MINT ? (
              <button disabled>SOLD OUT</button>
            ) : quantity <= 1 ? (
              <Web3Button
                contractAddress={contractAddress}
                action={(contract) => {
                  contract.call('claim', address, quantity)
                }}
                // isDisabled={!quantity || parseInt(quantity) < 1 || isLoading}
              >
                Mint{' '}
                {price
                  ? `(${
                      price?.toString() === '0'
                        ? 'Free'
                        : `${utils.formatEther(price)} ETH`
                    })`
                  : ''}
              </Web3Button>
            ) : (
              <Web3Button
                contractAddress={contractAddress}
                action={(contract) => {
                  contract.call('claim', address, quantity)
                }}
                // isDisabled={!quantity || parseInt(quantity) < 1 || isLoading}
              >
                Mint
              </Web3Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
