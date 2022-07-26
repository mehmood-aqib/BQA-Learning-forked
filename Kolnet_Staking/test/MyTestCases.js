const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const web3 = require("web3");
const provider = waffle.provider;

describe(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Staking Contract Test <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", function () {

  //it("Should deploy staking", async function () {
    beforeEach(async function(){
    [owner, addr1, addr2, ...addrs] = await provider.getWallets();
    const kolnet = await ethers.getContractFactory("KOLNET");
    kolnetToken = await kolnet.deploy();
    await kolnetToken.deployed();

    const dai = await ethers.getContractFactory("Dai");
    daiToken = await dai.deploy();

    const UNI = await ethers.getContractFactory("UNI");
    UNIToken = await UNI.deploy();

    const USDC = await ethers.getContractFactory("USDC");
    USDCToken = await USDC.deploy();

    const bal = await ethers.getContractFactory("BAL");
    balToken = await bal.deploy();

    const project = await ethers.getContractFactory("Stake");
     stake = await project.deploy("0xFcce5CE96D091395bef9f9c19306983e4D812c10", kolnetToken.address);
    //stake = await pro.deploy(owner.address, token.address);
     await stake.deployed();

     [owner, addr1, addr2, ...addrs] = await provider.getWallets();
     await kolnetToken.mint(owner.address, web3.utils.toWei("300"));
     await UNIToken.mint(stake.address, web3.utils.toWei("200"));
     await daiToken.mint(stake.address, web3.utils.toWei("200"));
     await USDCToken.mint(stake.address, web3.utils.toWei("200"));
     await balToken.mint(stake.address, web3.utils.toWei("200"));
    //  console.log("UNI Token Address:  ", UNIToken.address);
    //  console.log("Dai Token Address:  ", daiToken.address);
    //  console.log("USDC Token Address: ", USDCToken.address);
    //  console.log("BAL Token Address:  ", balToken.address);
     await kolnetToken.approve(stake.address, web3.utils.toWei("200"));
    
    })

    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Staking Tests <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

 // });

  it("Verify user can't stake 0 amount ", async function() {
    await expect(stake.stakeTokens(kolnetToken.address, web3.utils.toWei("0"))).to.be.reverted;
  });

  it("Verify user can stake with valid inputs ", async function() {
    // const ownerBal = await kolnetToken.balanceOf(owner.address);
    // console.log("balance of owner: ", web3.utils.fromWei(ownerBal.toString()));
    await stake.stakeTokens(kolnetToken.address,  web3.utils.toWei("10"));
  });

  it("Verify user can stake 1 wei amount ", async function() {
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("1"));
  });

  it("Verify when staked token in equal to token address in constructor ", async function() {
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
  });

  it("Verify when staked token is not equal to token address in constructor ", async function() {
    await expect(stake.stakeTokens(daiToken.address, web3.utils.toWei("10"))).to.be.revertedWith("Not KOL Token");
  });

  // it("Verify user has Balance greater than or equal to amount user is staking ", async function() {
  //   await expect(stake.stakeTokens(kolnetToken.address, web3.utils.toWei("301"))).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  // });

  it("Verify user has given Approval to Staking contract ", async function() {
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("200"));
  });

  it("Verify user can't stake amount, when approval is not given ", async function() {
    await expect(stake.stakeTokens(kolnetToken.address, web3.utils.toWei("201"))).to.be.revertedWith("RC20: insufficient allowance");
  });

  // it("Verify that user should not be able to stake when staking has been paused", async function(){
  //   await stake.pause();
  //   await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
  //   await stake.unpause();
  // });

  // // it("should unpause staking", async function(){
  // //   await stake.unpause();
  // // });

  it("Verify that user can input floating point values ", async function() {
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("0.01"));
  });

  it("Verify that user can't input negative values ", async function() {
    await expect(stake.stakeTokens(kolnetToken.address, web3.utils.toWei("-1"))).to.be.reverted;
  });

  it("Verify that when user stakes, user balance should decrease ", async function() {
    const ownerBalBefore = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalBefore);
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    const ownerBalAfter = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalAfter);
    await expect(web3.utils.fromWei(ownerBalAfter.toString())).to.be.equal("290"); 
  });

  // it("Verify when 2 users stake with equal weight  ", async function() {
  //   kolnetToken.transfer(owner.address, addr2.address, ethers.utils.parseEther("10"));
  //   await token.balanceOf(owner.address); 
  //   await token.balanceOf(addr2.address); 
  //   await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
  //   await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
  //   await token.balanceOf(owner.address); 
  // });

  // it("Verify when user1 has staked before, and new staking more tokens", async function(){
  //   await kolnetToken.transfer(addr2.address, web3.utils.toWei("10"));
  //   // await stake.connect(addr2).kolnetToken.approve(stake.address, web3.utils.toWei("10"));
  //   await kolnetToken.approve(stake.connect(addr2).stake.address, web3.utils.toWei("10"));
  //   await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
  //   //await stake.connect(addr2).stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
  // });


  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Unstaking Tests <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"

  it("Verify user can't unstake 0 amount ", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    await expect(stake.withDraw(kolnetToken.address, web3.utils.toWei("0"))).to.be.revertedWith("Can't unstake 0 value");
    
  });

  it("Verify user can unstake 1 wei amount ", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    const ownerBalBefore = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalBefore);
    await stake.withDraw(kolnetToken.address, web3.utils.toWei("1"));
    const ownerBalAfter = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalAfter);
    await expect(web3.utils.fromWei(ownerBalAfter.toString())).to.be.equal("291"); 
  });

  it("Verify that unstaked token in equal to token address in constructor", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    await stake.withDraw(kolnetToken.address, web3.utils.toWei("10"));
  });

  it("Verify when ustaked token is not equal to token address in constructor", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    await expect(stake.withDraw(daiToken.address, web3.utils.toWei("10"))).to.be.revertedWith("Not KOL TOKEN");;
  });

  it("Verify user can unstaked amount less than or equal to amount user has staked", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    const ownerBalBefore = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalBefore);
    await stake.withDraw(kolnetToken.address, web3.utils.toWei("5"));
    const ownerBalAfter = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalAfter);
    await expect(web3.utils.fromWei(ownerBalAfter.toString())).to.be.equal("295"); 
  });

  
  it("Verify user can't unstake, more than staked amount", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    await expect(stake.withDraw(kolnetToken.address, web3.utils.toWei("11"))).to.be.revertedWith("Invalid Amount");

  });

  it("Verify that when user unstakes, balance of contract decreases", async function (){
    const stakeAmount = "10";
    const unstakeAmount = "5";
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei(stakeAmount));
    //const ownerBalBefore = await kolnetToken.balanceOf(owner.address);
    const stakeBalBeforeUnstake = await kolnetToken.balanceOf(stake.address);
    await expect(web3.utils.fromWei(stakeBalBeforeUnstake.toString())).to.be.equal(stakeAmount); 
    //console.log("stake balance: ", stakeBal);
    //console.log(ownerBalBefore);
    await stake.withDraw(kolnetToken.address, web3.utils.toWei(unstakeAmount));
    const stakeBalAfterUnstake = await kolnetToken.balanceOf(stake.address);
    await expect(web3.utils.fromWei(stakeBalAfterUnstake.toString())).to.be.equal("5"); 
    const ownerBalAfter = await kolnetToken.balanceOf(owner.address);
    // //console.log(ownerBalAfter);
    await expect(web3.utils.fromWei(ownerBalAfter.toString())).to.be.equal("295"); 
  });

  it("Verify that when user unstakes, user balance should increase", async function (){
    const stakeAmount = "10";
    const unstakeAmount = "5";
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei(stakeAmount));
    const ownerBalBefore = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalBefore);
    await stake.withDraw(kolnetToken.address, web3.utils.toWei(unstakeAmount));
    const ownerBalAfter = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalAfter);
    await expect(web3.utils.fromWei(ownerBalAfter.toString())).to.be.equal("295"); 
  });

  it("Verify that user can input floating point values", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    const ownerBalBefore = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalBefore);
    await stake.withDraw(kolnetToken.address, web3.utils.toWei("0.1"));
    const ownerBalAfter = await kolnetToken.balanceOf(owner.address);
    //console.log(ownerBalAfter);
    await expect(web3.utils.fromWei(ownerBalAfter.toString())).to.be.equal("290.1"); 
  });

  it("Verify that user can't input negative values", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    await expect(stake.withDraw(kolnetToken.address, web3.utils.toWei("-1"))).to.be.reverted;

  });

  it("Verify that user can't withdraw before stake", async function (){
    await stake.stakeTokens(kolnetToken.address, web3.utils.toWei("10"));
    await expect(stake.connect(addr2).withDraw(kolnetToken.address, 1)).to.be.revertedWith('Invalid Amount');

  });

});
