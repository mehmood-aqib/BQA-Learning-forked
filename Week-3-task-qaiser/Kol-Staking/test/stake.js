//tobe reverted with and console.

//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const provider = waffle.provider;
describe("staking", function () {
  it("Should deploy staking", async function () {
    [owner, addr1, addr2, ...addrs] = await provider.getWallets();
    const tok = await ethers.getContractFactory("KOLNET");
    token = await tok.deploy();
    await token.deployed();
    const dai = await ethers.getContractFactory("Dai");
    daitoken = await tok.deploy();
    const UNI = await ethers.getContractFactory("UNI");
    UNItoken = await tok.deploy();
    const USDC = await ethers.getContractFactory("USDC");
    USDCtoken = await tok.deploy();
    const bal = await ethers.getContractFactory("BAL");
    baltoken = await bal.deploy();
    const project = await ethers.getContractFactory("Stake");
    stake = await project.deploy("0xFcce5CE96D091395bef9f9c19306983e4D812c10", token.address);
    //stake = await pro.deploy(owner.address, token.address);
    await stake.deployed();
  });

  it("get tokens", async function (){
    [owner, addr1, addr2, ...addrs] = await provider.getWallets();
    await token.mint(owner.address, web3.utils.toWei("1000"));
    await UNItoken.mint(owner.address, web3.utils.toWei("1000"));//UNI token mint to owner address
    await UNItoken.mint(stake.address, web3.utils.toWei("1000"));
    await daitoken.mint(stake.address, web3.utils.toWei("1000"));
    await USDCtoken.mint(stake.address, web3.utils.toWei("1000"));
    await baltoken.mint(stake.address, web3.utils.toWei("1000"));
    console.log(token.address);
    console.log(UNItoken.address);
    console.log(daitoken.address);
    console.log(USDCtoken.address);
    console.log(baltoken.address);
    await token.approve(stake.address, web3.utils.toWei("1000"));
  });


    it("Token address: {correct} Amount: {correct}", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("500"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct} Amount: {correct in decimals}", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("300.01"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct}", async function () {
      await stake.stakeTokens(token.address);
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Amount: {correct}", async function () {
      await stake.stakeTokens(web3.utils.toWei("300"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {incorrect} Amount: {correct}", async function () {
      await stake.stakeTokens(UNItoken.address, web3.utils.toWei("100"))
    });

    it.only("Token address: {correct} Amount: {incorrect}", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("1001"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct} Amount: -1", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("-1"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct} Amount: 00", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("00"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

     it.skip("Token address: {incorrect} Amount: {incorrect}", async function () {
      await stake.stakeTokens(UNItoken.address, web3.utils.toWei("1200"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Change Sequence of Args, Token address: {correct} Amount: {correct}", async function () {  //code=UNSUPPORTED_OPERATION
      await stake.stakeTokens(web3.utils.toWei("500"), token.address);
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });
});
    

describe("Withdrawing", function () {
    it("Token address: {correct} Amount: {correct}", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("150"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct} Amount: {correct in decimals}", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("100.999999"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct}", async function () {
      await stake.withDraw(token.address);
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Amount: {correct}", async function () {
      await stake.withDraw(web3.utils.toWei("99"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("No Argument", async function () {
      await stake.withDraw();
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {incorrect} Amount: {correct}", async function () {
      await stake.withDraw(UNItoken.address, web3.utils.toWei("200"));
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Token address: {correct} Amount: {incorrect}", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("1500"));
    });

    it.skip("Token address: {correct} Amount: -1", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("-1"));
    });

    it.skip("Token address: {correct} Amount: 0", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("-1"));
    });

    it.skip("Different sequence of Args, Amount: {correct} Token address: {correct} ", async function () {
      await stake.withDraw(web3.utils.toWei("100"), token.address);
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });
});