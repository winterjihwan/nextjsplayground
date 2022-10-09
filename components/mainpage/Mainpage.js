import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNFTBalances } from "react-moralis"
import { useEffect, useState } from "react"
import { abi } from "../../constants"
import { useNotification } from "@web3uikit/core"
import Moralis from "moralis"
import { EvmChain } from "@moralisweb3/evm-utils"
import { NFTBalance } from "@web3uikit/web3"

function Mainpage() {
  const { logout, authenticate, isAuthenticated, isWeb3EnableLoading, user, account } = useMoralis()
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances()
  const playgroundAddress = "0x10304C8689EF27C12634A80CA3A4a2F54082E20d"
  const [mintFee, setMintFee] = useState("0")
  const [curAccount, setCurAccount] = useState("")
  const dispatch = useNotification()

  useEffect(() => {
    if (isAuthenticated) {
      updateUI()
      setCurAccount(account)
      getNFTBalances()
    }
  }, [isAuthenticated])

  const updateUI = async () => {
    const mintFeeFromCall = await getMintFee()
    setMintFee(mintFeeFromCall?.toString())
  }

  const { runContractFunction: getMintFee } = useWeb3Contract({
    abi: abi,
    contractAddress: playgroundAddress,
    functionName: "getMintFee",
    params: {},
  })

  const {
    isLoading: mintLoading,
    isFetching: mintFetching,
    runContractFunction: mint,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: playgroundAddress,
    functionName: "mint",
    params: {
      mintAmount: 1,
    },
    msgValue: mintFee,
  })

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Successfully minted!",
      title: "Tx Notification",
      position: "top-right",
      icon: "bell",
    })
  }

  return (
    <div className="flex bg-gradient-to-br from-lime-100 to-blue-200 min-h-screen items-center justify-center">
      {/* Connect Button */}
      <div onClick={() => (isAuthenticated ? logout() : authenticate())} className=" absolute top-0 right-0 pt-8 pr-20">
        <a
          href="#_"
          className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
        >
          <span class="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-blue-500 rounded-full blur-md ease"></span>
          <span class="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
            <span class="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-blue-600 rounded-full blur-md"></span>
            <span class="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-blue-400 rounded-full blur-md"></span>
          </span>
          <span class="relative text-white">{isWeb3EnableLoading ? "Loading" : isAuthenticated ? "Connected" : "Connect"}</span>
        </a>
      </div>
      {/* Sliding Owned Nfts LEFT */}
      {/* <NFTBalance address={curAccount} chain="goerli" /> */}
      <div className=" absolute hidden lg:left-40 lg:flex items-center flex-col space-y-10">
        {data?.result.slice(0, 5).map((nft) => {
          return (
            <div>
              <img className="h-32 w-32 object-cover" src={nft.image} alt="" />
            </div>
          )
        })}
      </div>
      {/* Nft Mint Card */}
      <div className="flex flex-col min-h-[600px] min-w-[30%] bg-white shadow-xl shadow-rose-100/50 p-5 items-center">
        <h1 className=" mt-6 text-3xl font-extralight">Mint Playground</h1>
        <hr className=" my-3 w-48 border-cyan-600" />
        <img className="h-56 mt-20" src="https://gateway.pinata.cloud/ipfs/QmT2wXYYeA4dSTAK7wwMFVttZsLqGAcBbiXA8XE7jXSfwG/1.png" alt="" />
        {/* Mint Button */}
        <div
          onClick={async () =>
            await mint({
              onSuccess: handleSuccess,
              onError: (err) => console.log(err),
            })
          }
          className=" mt-20"
        >
          <a
            href="#_"
            className="relative inline-flex items-center justify-center  p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
          >
            <span class="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-blue-500 rounded-full blur-md ease"></span>
            <span class="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span class="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-blue-600 rounded-full blur-md"></span>
              <span class="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-blue-400 rounded-full blur-md"></span>
            </span>
            <span class="relative text-white">{mintLoading || mintFetching ? "loading..." : "Mint"}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Mainpage
