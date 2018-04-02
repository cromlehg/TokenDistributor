const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
var web3;
var ERC20Token;
var contractInstance;

function init(_network) {
  if (_network == "ropsten"){
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/bVnCJvRriSgJvp7ZeHuc"));
  }
  if (_network == "eth"){
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/bVnCJvRriSgJvp7ZeHuc"));
  }
  ERC20Token = web3.eth.contract(abi);
};

$(document).ready(function() {
  init("ropsten");
});

function setNetwork(_network) {
  init(_network);
};

function setToken(_tokenAddress) {
  contractInstance = ERC20Token.at(_tokenAddress);
};

function getWalletBalance(_walletAddress) {
  return contractInstance.balanceOf.call(_walletAddress);
};

function getTokenInfo() {
  $("#tokenInfo").html("Unknown token");
  let tokenAddress = $("#token").val();
  setToken(tokenAddress);

  let tokenName = contractInstance.name.call().toString();
  let tokenSymbol = contractInstance.symbol.call().toString();
  let tokenTotalSupply = contractInstance.totalSupply.call().toString();
  $("#tokenInfo").html(tokenName + "(" + tokenSymbol + ") Total supply: " + tokenTotalSupply);
};

function getBalanceInfo() {
  $("#balanceInfo").html("No balance info");
  let tokenAddress = $("#token").val();
  setToken(tokenAddress);

  let walletAddress = $("#wallet").val();
  let walletBalance = getWalletBalance(walletAddress);
  $("#balanceInfo").html(walletAddress + " Balance: " + walletBalance.toString());
};

function unlockWallet() {
  $("#unlockInfo").html("No information");
  let walletAddress = $("#wallet").val();
  let privateKey = $("#key").val();

  $("#unlockInfo").html("Try to unlock: " + walletAddress);

};

function sendTokens() {
  let log = "Start";
  $("#log").html(log);
  setToken($("#token").val());
  let walletAddress = $("#wallet").val();
  let walletBalance = getWalletBalance(walletAddress);
  let toAddress = $("#receiver").val();
  let privateKey = $("#key").val();

  log += "<br>Approval";
  $("#log").html(log);


  //contractInstance.approve(walletAddress, 600000, {from: walletAddress});
  //let allowance = contractInstance.allowance.call(walletAddress, walletAddress);
  //contractInstance.transferFrom(walletAddress, toAddress, 3000000, {from: walletAddress});


/*
  let data = contractInstance.transfer.getData(toAddress, 2000000, {from: walletAddress});
  //let data = contractInstance.transferFrom.getData(walletAddress, toAddress, 2000000, {from: walletAddress});

  let nonce = web3.toHex(web3.eth.getTransactionCount(walletAddress));
  let gasPrice = web3.toHex(web3.eth.gasPrice);

  let rawTransaction = {
    from: walletAddress,
    to: toAddress,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: '0x30000',
    value: "0x00",
    data: data
  };

  let tx = new EthJS.Tx(rawTransaction);

  privateKey = new EthJS.Buffer.Buffer(privateKey, 'hex');
  tx.sign(privateKey);

  let serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    if (!err)
      {
        log += "<br>Hash: " + hash;
        $("#log").html(log);
      }
    else
      {
        log += "<br>Error: " + err;
        $("#log").html(log);
      }
  });
*/

};
