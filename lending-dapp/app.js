// const Web3 = require('web3');
const express = require('express');
const app = express();
const port = 3000;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3('https://eth-sepolia.g.alchemy.com/v2/gx4po2I72kSM8tPaSWh_vRIkbBtYIlbG');

// const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/gx4po2I72kSM8tPaSWh_vRIkbBtYIlbG'); // Replace with an Ethereum node URL

const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_borrowerInterestRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_lenderInterestRate",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "principal",
          "type": "uint256"
        }
      ],
      "name": "Borrowed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "name": "Lent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Repaid",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawn",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "borrowerInterestRate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lenderInterestRate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "lends",
      "outputs": [
        {
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "principal",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "loans",
      "outputs": [
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "principal",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "collateral",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "dueDate",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalLent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lend",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_collateral",
          "type": "uint256"
        }
      ],
      "name": "borrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "repay",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawLenderBalance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "getLoanDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "principal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "collateral",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "dueDate",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct LendingPlatform.Loan",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newInterestRate",
          "type": "uint256"
        }
      ],
      "name": "setBorrowerInterestRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newInterestRate",
          "type": "uint256"
        }
      ],
      "name": "setLenderInterestRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const contractAddress = '0x58C4f4b18F675a88840539ab9199D23a7f55E46a'; // Replace with your contract's address

const contract = new web3.eth.Contract(contractABI, contractAddress);
app.use(express.static('frontend'));
app.use(express.static('frontend', { "extensions": ["html", "htm"] }));
app.use(express.static('frontend/styles.css', { "extensions": ["css"] }));

app.use(express.static('app.js', { "extensions": ["js"] }));

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
// Read the HTML file's content
const htmlFilePath = "./frontend/index.html"; // Update with your HTML file path
const html = fs.readFileSync(htmlFilePath, "utf-8");
global.document = new JSDOM(html).window.document;
// Function to lend funds
document.getElementById('lendButton').addEventListener('click', async () => {
  const amount = document.getElementById('lendAmount').value;

  try {
    // Request access to the user's Ethereum accounts
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const fromAccount = accounts[0];

    // Create a transaction object
    const transactionObject = {
      from: fromAccount,
      to: contractAddress,
      value: web3.utils.toWei(amount, 'ether'), // Convert amount to wei
    };

    // Send the transaction
    const transactionHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionObject],
    });

    document.getElementById('output').innerHTML = `Lent: ${transactionHash}`;
  } catch (error) {
    console.error('Error lending:', error);
    document.getElementById('output').innerHTML = `Error lending: ${error.message}`;
  }
});

 // Function to connect to MetaMask
 document.getElementById('connectButton').addEventListener('click', async () => {
  try {
    // Request access to the user's Ethereum accounts
    await ethereum.request({ method: 'eth_requestAccounts' });

    // You can now interact with Ethereum using the connected account
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const connectedAccount = accounts[0];
    console.log('Connected account:', connectedAccount);
    document.getElementById('output').innerHTML = `Connected to MetaMask: ${connectedAccount}`;

    // Hide the "Connect to MetaMask" section
    document.getElementById('connectSection').style.display = 'none';

    // Show the lending, borrowing, and other sections
    document.getElementById('lendSection').style.display = 'block';
    document.getElementById('borrowSection').style.display = 'block';
    document.getElementById('repaySection').style.display = 'block';
    document.getElementById('withdrawSection').style.display = 'block';
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    document.getElementById('output').innerHTML = `Error connecting to MetaMask: ${error.message}`;
  }
});




// Function to update contract balance
async function updateContractBalance() {
  try {
    // You will need to implement code to fetch the contract balance from the Ethereum network
    // Example:
    const contractBalance = await web3.eth.getBalance(contractAddress);
    document.getElementById('balance').innerHTML = `Contract Balance: ${web3.utils.fromWei(contractBalance, 'ether')} ETH`;
  } catch (error) {
    console.error('Error updating contract balance:', error);
    document.getElementById('balance').innerHTML = 'Error updating contract balance';
  }
}

// Function to borrow funds
document.getElementById('borrowButton').addEventListener('click', async () => {
  const amount = document.getElementById('borrowAmount').value;
  const collateral = document.getElementById('collateral').value;
  const accounts = await web3.eth.getAccounts();

  try {
    const result = await contract.methods.borrow(amount, collateral).send({
      from: accounts[0]
    });
    document.getElementById('output').innerHTML = `Borrowed: ${result.transactionHash}`;
  } catch (error) {
    console.error('Error borrowing:', error);
  }
});

// Function to repay loan
document.getElementById('repayButton').addEventListener('click', async () => {
  const amount = document.getElementById('repayAmount').value;
  const accounts = await web3.eth.getAccounts();

  try {
    const result = await contract.methods.repay().send({
      from: accounts[0],
      value: web3.utils.toWei(amount, 'ether') // Convert amount to wei
    });
    document.getElementById('output').innerHTML = `Repaid: ${result.transactionHash}`;
  } catch (error) {
    console.error('Error repaying:', error);
  }
});

// Function to withdraw lender balance
document.getElementById('withdrawButton').addEventListener('click', async () => {
  const accounts = await web3.eth.getAccounts();

  try {
    const result = await contract.methods.withdrawLenderBalance().send({
      from: accounts[0]
    });
    document.getElementById('output').innerHTML = `Withdrawn: ${result.transactionHash}`;
  } catch (error) {
    console.error('Error withdrawing:', error);
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
