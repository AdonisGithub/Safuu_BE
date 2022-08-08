const Web3 = require("web3");
const SafuuContract = require("./safuu.json").abi;
const fromExponential = require("from-exponential");

let circSupply = '';
let totalSupply = '';

const trim = (number, precision ) => {
    const array = fromExponential(number).split(".");
    if (array.length === 1) return fromExponential(number);
    //@ts-ignore
    array.push(array.pop().substring(0, precision));
    const trimmedNumber = array.join(".");
    return trimmedNumber;
};

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org'));
} 

exports.loadAndSaveChainData = async () => {

    try{

        const SAFUU_ADDRESS = "0xE5bA47fD94CB645ba4119222e34fB33F59C7CD90";
        const FIREPIT_ADDRESS = "0xaA32C984AfDfa6B95e88B8aB7faBfa65De89b98C";
        const safuuContract = new web3.eth.Contract( SafuuContract,SAFUU_ADDRESS);
        totalSupply =trim(await safuuContract.methods.totalSupply().call() / Math.pow(10,5),5) ;
        const firePitSafuuBalance = await safuuContract.methods.balanceOf(FIREPIT_ADDRESS).call() / Math.pow(10,5);
        circSupply = trim(totalSupply - firePitSafuuBalance,5) ;
        console.log(circSupply)

    } catch(err) {

        console.log(err);
    }
}

exports.getChainData = (req, res) => {
    
    const q  = req.query.q;
    if( q == "totalcoins" ) {
        res.status(200).send(totalSupply);
    } else if( q == "circulating" ) {      
        res.status(200).send(circSupply);
    }
    return;
}

