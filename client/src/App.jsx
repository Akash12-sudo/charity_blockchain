import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";
import Web3 from "web3";
import { useState, useEffect, useCallback, useContext } from "react";
import { useEth } from "./contexts/EthContext";


function App() {

  let address, contract;
  const [Account, setAccount] = useState()

  const init = useCallback(
    async artifact => {
      if (artifact) {

        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts)
        const networkID = await web3.eth.net.getId();
        console.log(networkID)

        const { abi } = artifact;

        try {
          address = artifact.networks[networkID].address;
          console.log(address);
          contract = new web3.eth.Contract(abi, address);
          console.log(contract)
          const count = await contract.methods.getCampaignCount().call({ from: accounts[0] });
          console.log(count)

          const id = await contract.methods._campaignsList(4).call({ from: accounts[0] });
          console.log(id);


          console.log( await contract.methods._campaigns(id).call({ from: accounts[0] }))

          // const campaign = await contract.methods.getCampaign('0xeace911f64f82b4026965ea535e84d8479feced537eacd0d05043c1112204051').call({ from: accounts[0] });
          // console.log(campaign)

          // console.log(await contract.methods._campaigns('0xdc02bb8ba94cca6c00a3b3cc9c89df8243dc4c2ec4315fa0f8c0e43e89eb1017').call({ from: accounts[0]  }))
        } 
        catch (err) {
          console.error(err);
        }

      }
    }, []);

  useEffect(() => {

    const tryInit = async () => {
      try {
        const artifact = require("./contracts/Charity.json");
        init(artifact);
      } 
      catch (err) {
        console.error(err);
      }
    };

    tryInit();

  }, [init]);





  const [data, setData ] = useState({
    title: '',
    img_url: '',
    desc: ''
  })

  function handleChange (e) {
    
    const id = e.target.id
    const value = e.target.value
    setData((prev) => ({ ...prev, [id]: value}))
  }

  async function handleSubmit (e) {
    
    e.preventDefault();
    console.log(data)

    
  }

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
        <form method="POST" onSubmit={handleSubmit}>
          <input type="text" placeholder = "title" id = "title" onChange = {handleChange} />
          <input type="text" placeholder = "img_url" id = "img_url" onChange = {handleChange} />
          <textarea rows='10'cols ='10' type="text" placeholder = "desc" id = "desc" onChange = {handleChange} />
          <button type="submit" >Submit</button>
        </form>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
