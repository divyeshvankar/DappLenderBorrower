const LendingPlatform = artifacts.require("LendingPlatform");

module.exports = function (deployer) {
  deployer.deploy(LendingPlatform, 100, 50); // Deploy with initial borrower and lender interest rates
};


// 2_deploy_contracts.js
// =====================

//    Deploying 'LendingPlatform'
//    ---------------------------
//    > transaction hash:    0xe81888b7f01a879971a15c59be03458293f912976b683f2ffc76c97baa7eeca3
//    > Blocks: 2            Seconds: 22
//    > contract address:    0x58C4f4b18F675a88840539ab9199D23a7f55E46a
//    > block number:        4203881
//    > block timestamp:     1693568244
//    > account:             0xa320f322f7C57F981c93C07b9eE9758bb19ECEaB
//    > balance:             0.497084033492723832
//    > gas used:            1551685 (0x17ad45)
//    > gas price:           1 gwei
//    > value sent:          0 ETH
//    > total cost:          0.001551685 ETH

//    Pausing for 2 confirmations...

//    -------------------------------
//    > confirmation number: 1 (block: 4203882)
//    > confirmation number: 2 (block: 4203883)
//    > Saving artifacts
//    -------------------------------------
//    > Total cost:         0.001551685 ETH

// Summary
// =======
// > Total deployments:   1
// > Final cost:          0.001551685 ETH

