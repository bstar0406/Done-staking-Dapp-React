import React from 'react'
import { ethers, Signer } from 'ethers'
import TokenContract from './contract/token.json'
import StakingContract from './contract/staking.json'

const tokenAddress:string = '0x69efB039728013bB9f6Ab13015621f74C544ED3C';
const stakingAddress:string = '0xf7f903fD2EE71Ce6D8473f5a46b7465EA834D79f';

function App() {
  const [currentAccount, setCurrentAccount] = React.useState<string>('');
  const [option, setOption] = React.useState<number>(0);
  const [amount, setAmount] = React.useState<number>(0);
  const [caption, setCaption] = React.useState<string>('Flexible Mode - 10%')
  
  React.useEffect(() => {
    checkWalletIsConnected()
  }, [])
  const checkWalletIsConnected = async () => {
    const { ethereum } = window as any

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!')
      return
    } else {
      console.log("Wallet exists! We're ready to go!")
      if ((window as any).ethereum) {
        (window as any).ethereum.send('eth_requestAccounts');
        (window as any).provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
        );
        (window as any).signer =  (window as any).provider.getSigner();
        (window as any).tokenContract = new ethers.Contract(
          tokenAddress,
          TokenContract,
          (window as any).signer,
        );
        (window as any).stakingContract = new ethers.Contract(
          stakingAddress,
          StakingContract,
          (window as any).signer,
        );
        const tokenContractName = await (window as any).tokenContract.name();
        const stakingContractName = await (window as any).stakingContract;
        console.log(stakingContractName);
      }
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account: ', account)
      setCurrentAccount(account)
    } else {
      console.log('No authorized account found')
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window as any

    if (!ethereum) {
      alert('Please install Metamask!')
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Found an account! Address: ', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (err) {
      console.log(err)
    }
  }

  const changeOption = (val:number, str:string) =>{
    setOption(val);
    setCaption(str);
  }

  const changeAmount = (val:string) =>{
    setAmount(parseInt(val))
  }
  const deposit = async () =>{
    await (window as any).tokenContract.approve(stakingAddress, amount);
    await (window as any).stakingContract.deposit(amount, option);
    console.log('success')
  }
  return (
    <div className="d-flex flex-column px-5">
      <div className="mt-5 d-flex flex-warp justify-content-end">
        <span className="d-flex align-items-center">
          <div>{currentAccount}</div>
        </span>
        <button className="btn btn-danger mr-5" onClick={connectWalletHandler}>
          Connect Wallet
        </button>
      </div>
      <div className="mt-5 d-flex justify-content-around">
        <button className="btn btn-primary mr-5" onClick={()=>changeOption(0, 'Flexible Mode - 10%')}>Flexible Mode - 10%</button>
        <button className="btn btn-info mr-5" onClick={()=>changeOption(1, '30 days - 25%')}>30 days - 25%</button>
        <button className="btn btn-warning mr-5" onClick={()=>changeOption(2, '90 days - 40%')}>90 days - 40%</button>
        <button className="btn btn-danger mr-5" onClick={()=>changeOption(3, '180 days - 70%')}>180 days - 70%</button>
        <button className="btn btn-secondary mr-5" onClick={()=>changeOption(4, '360 days - 90%')}>360 days - 90%</button>
      </div>
      <div className="mt-5 d-flex justify-content-around align-items-center">
        <span className=''>{caption}</span>
        <input type="number" className='form-control w-50 mr-5' placeholder='Deposit amount' onChange={(e)=>changeAmount(e.target.value)} />
        <button className="btn btn-primary mr-5" onClick={deposit}>Deposit</button>
      </div>
    </div>
  )
}

export default App
