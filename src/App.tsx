import React from 'react'
import { ethers } from 'ethers'
import TokenContract from './contract/token.json'
import StakingContract from './contract/staking.json'
import Logo from './assets/iamges/logo.jpg'

const tokenAddress: string = '0x85469cB22c5e8A063106C987c36C7587810E4bF1' //main token
// const tokenAddress: string = '0x85469cB22c5e8A063106C987c36C7587810E4bF1' // main token

// const stakingAddress: string = '0xa0d8780C32Ba63748951a6Ef5D7f43F7CBd79c58' //test staking
const stakingAddress: string = '0x3E54e556d4054C9A31A632545746D1b3CAE4de83' //main staking

function App() {
  const [currentAccount, setCurrentAccount] = React.useState<string>('')
  const [option, setOption] = React.useState<number>(0)
  const [amount, setAmount] = React.useState<number>(0)
  const [caption, setCaption] = React.useState<string>('Flexible Mode - 10%')
  const [balance, setBalance] = React.useState<string>('0 IGRL')
  const [stakingInfo, setStakingInfo] = React.useState<any>({
    startTime: '-',
    balance: '0 IGRL',
    option: 'Flexible',
    expireTime: '-',
  })
  React.useEffect(() => {
    const checkWalletIsConnected = async () => {
      const { ethereum } = window as any
      if (!ethereum) {
        return
      } else {
        if ((window as any).ethereum) {
          (window as any).ethereum.send('eth_requestAccounts');
          (window as any).provider = new ethers.providers.Web3Provider(
            (window as any).ethereum,
          );
          (window as any).signer = (window as any).provider.getSigner();
          (window as any).tokenContract = new ethers.Contract(
            tokenAddress,
            TokenContract,
            (window as any).signer,
          );
          (window as any).stakingContract = new ethers.Contract(
            stakingAddress,
            StakingContract,
            (window as any).signer,
          )
        }
      }
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    const stakingInfo = await (window as any).stakingContract.getStakingInfo(
      accounts[0],
    )
    const startTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000);
    const balance = parseInt(stakingInfo.balance);
    const option = parseInt(stakingInfo.option);
    let optionString, expireTime;
    switch (option) {
      case 0:
        optionString = 'Flexible'
        expireTime = 'None'
        break
      case 1:
        optionString = '30 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*30)
        break
      case 2:
        optionString = '90 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*90)
        break
      case 3:
        optionString = '180 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*180)
        break
      case 4:
        optionString = '360 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*360)
        break
      default:
        break
    }
    let realTime=padStart(startTime.getUTCDate()).toString()+"."+padStart((startTime.getUTCMonth()+1)%12)+"."+startTime.getUTCFullYear() +" - "+padStart(startTime.getUTCHours()).toString()+":"+padStart(startTime.getUTCMinutes()) + " UTC";
    if(balance === 0){
      expireTime = '-';
      optionString ='-';
      realTime='-'
      
    }
    setBalance(balance.toString() + ' IGRL');
    setStakingInfo({
      startTime: realTime,
      balance: (balance/10**9).toString() + ' IGRL',
      option: optionString?.toString(),
      expireTime: expireTime?.toString()
    })
  
      if (accounts.length !== 0) {
        const account = accounts[0]
        setCurrentAccount(account)
      } 
      (window as any).stakingContract.on("DepositEvent", (oldValue:any, newValue:any, event:any) => {
        // setInfo()
      })
      // (window as any).stakingContract.on("WithdrawEvent", (oldValue:any, newValue:any, event:any) => {

      // })
    }
    checkWalletIsConnected()
  },[])

  const setInfo = async ()=>{
    const { ethereum } = window as any
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    const stakingInfo = await (window as any).stakingContract.getStakingInfo(
      accounts[0],
    )
    const startTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000);
    const balance = parseInt(stakingInfo.balance);
    const option = parseInt(stakingInfo.option);
    let optionString, expireTime;
    switch (option) {
      case 0:
        optionString = 'Flexible'
        expireTime = 'None'
        break
      case 1:
        optionString = '30 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*30)
        break
      case 2:
        optionString = '90 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*90)
        break
      case 3:
        optionString = '180 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*180)
        break
      case 4:
        optionString = '360 days'
        expireTime = new Date(parseInt(stakingInfo.startTime, 10) * 1000 + 1000*3600*24*360)
        break
      default:
        break
    }
    let realTime=padStart(startTime.getUTCDate()).toString()+"."+padStart((startTime.getUTCMonth()+1)%12)+"."+startTime.getUTCFullYear() +" - "+padStart(startTime.getUTCHours()).toString()+":"+padStart(startTime.getUTCMinutes()) + " UTC";
    if(balance === 0){
      expireTime = '-';
      optionString ='-';
      realTime='-'
      
    }
    setBalance(balance.toString() + ' IGRL');
    let temp =stakingInfo;
    console.log(temp)
    temp.startTime = realTime;
    temp.balance =  (balance/10**9).toString() + ' IGRL';
    temp.option= optionString?.toString();
    temp.expireTime= expireTime?.toString()
    setStakingInfo(temp)
  }

  const padStart = (str:number) =>{
    let temp = str <= 9 ? '0' + str : str;
    return temp;
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window as any

    if (!ethereum) {
      alert('Please install Metamask!')
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (err) {
      
    }
  }

  const changeOption = (val: number, str: string) => {
    setOption(val)
    setCaption(str)
  }

  const changeAmount = (val: string) => {
    setAmount(parseInt(val))
  }
  const deposit = async () => {
    if(balance === '0 IGRL'){
      await (window as any).tokenContract.approve(stakingAddress, amount*Math.pow(10,9))
      await (window as any).stakingContract.deposit(amount*Math.pow(10,9), option)
      alert('success');
      setInfo();
    }else{
      alert("You've already staked")
    }
    
  }
  const unstake = async () => {
    await (window as any).stakingContract.withdraw()
    alert('success');
    setInfo();
  }


  return (
    <div>
      <div className="d-flex flex-warp justify-content-between py-2 px-5 bar">
        <div>
          <img src={Logo} alt="logo" width={80} height={80} />
        </div>
        <div className="d-flex">
          <span className="d-flex align-items-center">
            <div>{currentAccount}</div>
          </span>
          <button className="btn btn-grad mr-5" onClick={connectWalletHandler}>
            Connect Wallet
          </button>
        </div>
      </div>
      <div className="d-flex flex-column px-5">
        <div className="mt-5 d-flex justify-content-around">
          <button
            className="btn btn-grad mr-5"
            onClick={() => changeOption(0, 'Flexible Mode - 10%')}
          >
            Flexible Mode - 10%
          </button>
          <button
            className="btn btn-grad mr-5"
            onClick={() => changeOption(1, '30 days - 15%')}
          >
            30 days - 15%
          </button>
          <button
            className="btn btn-grad mr-5"
            onClick={() => changeOption(2, '90 days - 25%')}
          >
            90 days - 25%
          </button>
          <button
            className="btn btn-grad mr-5"
            onClick={() => changeOption(3, '180 days - 35%')}
          >
            180 days - 35%
          </button>
          <button
            className="btn btn-grad mr-5"
            onClick={() => changeOption(4, '360 days - 50%')}
          >
            360 days - 50%
          </button>
        </div>
        <div className="mt-5 d-flex justify-content-around align-items-center">
          <span className="">{caption}</span>
          <input
            type="number"
            className="form-control w-50 mr-5"
            placeholder="Deposit amount"
            onChange={(e) => changeAmount(e.target.value)}
          />
          <button className="btn btn-grad mr-5" onClick={deposit}>
            Stake
          </button>
        </div>
        <div className="mt-5 d-flex justify-content-around align-items-center">
          <table className="table mt-5">
            <thead>
              <tr>
                <th>Time of Stake</th>
                <th>Amount</th>
                <th>What option</th>
                <th>Expires</th>
                <th>Unstake</th>
              </tr>
            </thead>
            <tbody>
              {stakingInfo.balance !=='0 IGRL' &&<tr>
                <td>{stakingInfo.startTime}</td>
                <td>{stakingInfo.balance}</td>
                <td>{stakingInfo.option}</td>
                <td>{stakingInfo.expireTime}</td>
                <td>
                  {stakingInfo.option==='Flexible' && <button className="btn btn-grad" onClick={()=>unstake()}>Unstake</button>}
                  {stakingInfo.option!=='Flexible' && 'Unstake automatically'}
                </td>
              </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
