const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
var web3;
var ERC20Token;
var contractInstance;
var networkHref = "https://ropsten.etherscan.io/tx/";

function viewLog(_log) {
  $("#log").append(_log);
};

function init(_network) {
  if (_network == "ropsten"){
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/bVnCJvRriSgJvp7ZeHuc"));
    networkHref = "https://ropsten.etherscan.io/tx/";
  }
  if (_network == "eth"){
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/bVnCJvRriSgJvp7ZeHuc"));
    networkHref = "https://etherscan.io/tx/";
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
  try{
    contractInstance = ERC20Token.at(_tokenAddress);
    let tokenName = contractInstance.name.call().toString;
  }
  catch(error){
    throw error;
  }
};

function getWalletBalance(_walletAddress) {
  return contractInstance.balanceOf.call(_walletAddress);
};

function getReceiversList(){
  return $("#receiver").val().split('\n');
};

function clearInfo(){
  $("#log").html("Log info:");
  $('#table tr:not(:first)').remove();
}

$(document).on("input",function(ev){
  clearInfo();
});

function getTokenInfo() {
  $("#tokenInfo").html("Unknown token");
  let tokenAddress = $("#token").val();
  try {
    setToken(tokenAddress);
  } catch (error){
    return false;
  }

  let tokenName = contractInstance.name.call().toString();
  let tokenSymbol = contractInstance.symbol.call().toString();
  let tokenTotalSupply = contractInstance.totalSupply.call().toString();
  $("#tokenInfo").html(tokenName + "(" + tokenSymbol + ") Total supply: " + tokenTotalSupply);
};

$(function(){
  $("#token").on("blur", function(){
    getTokenInfo();
  });
});


function getBalanceInfo() {
  $("#balanceInfo").html("No balance info");
  let tokenAddress = $("#token").val();
  try {
    setToken(tokenAddress);
  } catch (error){
    return false;
  }

  let walletAddress = $("#wallet").val();
  let walletBalance = getWalletBalance(walletAddress);
  $("#balanceInfo").html("Balance: " + walletBalance.toString());
};

$(function(){
  $("#wallet").on("blur", function(){
    getBalanceInfo();
  });
});

function getPersonalAmount(_walletBalance, _receivers){
  let receiversNumber = _receivers.length;
  if (receiversNumber != 0){
    return Math.floor(_walletBalance / receiversNumber);
  }
  return 0;
};

function sendTokens() {
  let tokenAddress = $("#token").val();
  try{
    setToken(tokenAddress);
  }
  catch(error){
    throw new Error("<br>Token identification error: " + error.message);
  }

  let tokenSymbol = contractInstance.symbol.call().toString();

  let walletAddress = $("#wallet").val();
  if(walletAddress == ""){
    throw new Error("<br>No wallet address entered.");
  }
  let walletBalance = getWalletBalance(walletAddress);
  if (walletBalance == 0){
    throw new Error("<br>You have no tokens to send: wallet balance = 0");
  }

  let privateKey = $("#key").val();
  if(privateKey == ""){
    throw new Error("<br>No private key entered.");
  }

  let key;
  try{
    key = new EthJS.Buffer.Buffer(privateKey, 'hex');
  }
  catch(error){
    throw new Error("<br>Private key convert error: " + error.message);
  }

  let toAddress = $("#receiver").val();
  let receivers = getReceiversList();

  if(receivers == ""){
    throw new Error("<br>No receivers addresses entered.");
  }

  let sendValue = $("#sendvalue").val();
  sendValue = getPersonalAmount(sendValue, receivers);
  if(sendValue == 0){
    throw new Error("<br>Not enough tokens for all receivers.");
  }

  let nonce;
  let prevNonce;

  nonce = web3.eth.getTransactionCount(walletAddress);
  if (nonce != 0){
    prevNonce = nonce - 1;
  }

  let allowance = contractInstance.allowance.call(walletAddress, walletAddress);

  if (allowance < sendValue){
    viewLog("<br><i>Prepare approve transaction...</i>");

    let data = contractInstance.approve.getData(walletAddress, walletBalance, {from: walletAddress});

    let gasPrice = web3.toHex(web3.eth.gasPrice);
    let rawTransaction = {
      from: walletAddress,
      to: tokenAddress,
      nonce: web3.toHex(nonce),
      gasPrice: gasPrice,
      gasLimit: '0x30000',
      value: "0x00",
      data: data
    };

    let tx = new EthJS.Tx(rawTransaction);
    tx.sign(key);

    let serializedTx = tx.serialize();

    viewLog("<br>Send approve transaction...");

    prevNonce = nonce;

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (!err)
        {
          viewLog("<br>Hash: " + hash);
          viewLog("<br><a target='_blank' href='" + networkHref + hash + "'>View transaction info</a>");
          let txReceipt;
          while (!txReceipt){
            txReceipt = web3.eth.getTransactionReceipt(hash);
          }
          viewLog("<br>Approve transaction completed.<br>");
        }
      else
        {
          throw new Error("<br>" + err + "<br>Approve transaction failed.<br>");
        }
    });

    nonce = web3.eth.getTransactionCount(walletAddress);
    while(prevNonce == nonce){
      nonce = web3.eth.getTransactionCount(walletAddress);
    }
  }

  viewLog("<br><i>Prepare transfer transactions...</i>");
  viewLog("<br>From " + walletAddress);
  viewLog("<br>To " + toAddress);
  viewLog("<br>" + sendValue + " " + tokenSymbol + " tokens to each");

  for(let i = 0; i < receivers.length; i++){
    $("#table").last().append("<tr><td>" + (i + 1) + "</td><td>"
      + receivers[i] + "</td><td>" + sendValue + "</td><td id='status" + i + "'>pending...</td></tr>");

    data = contractInstance.transferFrom.getData(walletAddress, receivers[i], sendValue, {from: walletAddress});

    nonce = web3.eth.getTransactionCount(walletAddress);
    while(prevNonce == nonce){
      nonce = web3.eth.getTransactionCount(walletAddress);
    }

    gasPrice = web3.toHex(web3.eth.gasPrice);
    rawTransaction = {
      from: walletAddress,
      to: tokenAddress,
      nonce: web3.toHex(nonce),
      gasPrice: gasPrice,
      gasLimit: '0x30000',
      value: "0x00",
      data: data
    };

    tx = new EthJS.Tx(rawTransaction);
    tx.sign(key);

    serializedTx = tx.serialize();

    viewLog("<br>Send transfer transaction " + (i + 1) + "...");

    prevNonce = nonce;
    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (!err)
        {
          viewLog("<br>Hash: " + hash);
          viewLog("<br><a target='_blank' href='" + networkHref + hash + "'>View transaction info</a>");
          txReceipt = web3.eth.getTransactionReceipt(hash);
          while (txReceipt == null){
           txReceipt = web3.eth.getTransactionReceipt(hash);
          }
          viewLog("<br>Transfer transaction completed.<br>");
          $("#status" + i).html("<a target='_blank' href='" + networkHref + hash + "'>ready</a>");
        }
      else
        {
          viewLog("<br>" + err + "<br>Transfer transaction failed.<br>");
          $("#status" + i).html("error");
          nonce = web3.eth.getTransactionCount(walletAddress);
          if(nonce != 0){
            prevNonce = web3.eth.getTransactionCount(walletAddress) - 1;
          }
          else{
            prevNonce = null;
          }
        }
    });
  }

};

$(function(){
  $(".btn").on("click", function(){
    clearInfo();
    viewLog("<br>You press Unlock wallet and send tokens Button...");
    try{
      sendTokens();
    }
    catch(error){
      viewLog("<br>Some errors occured: " + error.message);
    }
    finally{
      viewLog("<br>Processing finished.");
    }
  });
});
