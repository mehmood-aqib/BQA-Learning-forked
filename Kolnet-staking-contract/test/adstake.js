const { expect } = require("chai");
//const { intToBuffer, toChecksumAddress, MAX_UINT64 } = require("ethereumjs-util");
const { ethers, waffle } = require("hardhat");
const web3 = require("web3");
//const provider = waffle.provider;

const [
    owner,
    alice,
    bob,
    carol,
    other,
    staking,
    addr1,
    addr2,
    user3,
    user4,
  ] = waffle.provider.getWallets();

describe("Stake fn test", function (){
    it("Should deploy staking contract and diplay reward token addresses", async function () {
        //[owner, addr1, addr2, ...addrs] = await provider.getWallets();
        const tok = await ethers.getContractFactory("KOLNET");
        KOLtoken = await tok.deploy();
        await KOLtoken.deployed();  //what is the diff b/w deploy and deployed

        const DAI = await ethers.getContractFactory("Dai");

        DAItoken= await tok.deploy();

        const UNI = await ethers.getContractFactory("UNI");
        UNItoken = await tok.deploy();

        const USDC = await ethers.getContractFactory("USDC");
        USDCtoken = await tok.deploy();


        const project = await ethers.getContractFactory("Stake");
        stake =  await project.deploy(owner.address, KOLtoken.address)
        await stake.deployed();
    });

    it("Should mint tokens", async function (){
        //[owner, addr1, addr2, ...addrs] = await provider.getWallets();
        await KOLtoken.mint(owner.address, web3.utils.toWei("2000"));
        await UNItoken.mint(stake.address, web3.utils.toWei("2000"));
        await DAItoken.mint(stake.address, web3.utils.toWei("2000"));
        await USDCtoken.mint(stake.address, web3.utils.toWei("2000"));

        //try a test case will USDT
        console.log("UNI token address:" ,UNItoken.address);
        console.log("DAI token address:" ,DAItoken.address);
        console.log("USDC token address:" ,USDCtoken.address); 
        await KOLtoken.approve(stake.address, web3.utils.toWei("1000"));  
    });

    it("Should stake KOL token", async function (){
        await stake.stakeTokens(KOLtoken.address, web3.utils.toWei("100")); //2000-100=1900
        const tx1 = await KOLtoken.balanceOf(owner.address); 
        console.log("balance of owner", web3.utils.fromWei(tx1.toString()));
        const tx17 = await stake._balances(owner.address);
        console.log("how much owner has staked", ethers.utils.formatEther(tx17));   //100

        //console.log(tx1);
    });

    it("Should stake 1 wei amount from user2", async function(){  
        //await KOLtoken.transferFrom(owner.address, addr2.address, web3.utils.toWei("100")); //yeh galat line h, tranferFrom contract k liye use hota hai
        await KOLtoken.connect(owner).transfer(addr2.address, web3.utils.toWei("100")) //owner 1900-100=1800 //treansfer from owner to user2
        const tx2 = await KOLtoken.balanceOf(owner.address); 
        console.log("balance of owner", web3.utils.fromWei(tx2.toString()));
        const tx3 = await KOLtoken.balanceOf(addr2.address); 
        console.log("balance of user2 before staking", web3.utils.fromWei(tx3.toString())); //100

        await KOLtoken.connect(addr2).approve(stake.address, web3.utils.toWei("1000"));  //MAX_UINT64
        await stake.connect(addr2).stakeTokens(KOLtoken.address, web3.utils.toWei("0.000000000000000001"));
        const tx4 = await KOLtoken.balanceOf(addr2.address); 
        console.log("balance of user2 after staking", web3.utils.fromWei(tx4.toString())); //99.999999999999999999
    });

    it("Should not allow user3 to stake 0 amount", async function(){ 
        await KOLtoken.connect(owner).transfer(addr1.address, web3.utils.toWei("100")) //owner 1800-100=1700 //treansfer from owner to user2
        const tx5 = await KOLtoken.balanceOf(owner.address); 
        console.log("balance of owner", web3.utils.fromWei(tx5.toString()));  //1700
        const tx6 = await KOLtoken.balanceOf(addr1.address); 
        console.log("balance of user1 before staking", web3.utils.fromWei(tx6.toString()));  //100

        await KOLtoken.connect(addr1).approve(stake.address, web3.utils.toWei("1000")); 
        await expect(stake.connect(addr1).stakeTokens(KOLtoken.address, web3.utils.toWei("0"))).to.be.revertedWith("AZ");
        //stake.connect(addr1).stakeTokens(KOLtoken.address, web3.utils.toWei("0"));
        const tx7 = await KOLtoken.balanceOf(addr1.address); 
        console.log("balance of user1 after staking", web3.utils.fromWei(tx7.toString())); //100
    });

    it("Should not let user stake any other token than KOL", async function(){
        await DAItoken.mint(addr1.address, web3.utils.toWei("2000"));
        await expect(stake.connect(addr1).stakeTokens(DAItoken.address, web3.utils.toWei("1000"))).to.be.revertedWith('Not KOL Token');
        const tx8 = await KOLtoken.balanceOf(addr1.address); 
        console.log("balance of KOL token of user1 after staking", web3.utils.fromWei(tx8.toString())); //100

        const tx9 = await DAItoken.balanceOf(addr1.address); 
        console.log("balance of DAI token of user1 after staking", web3.utils.fromWei(tx9.toString())); //2000
    });

    it("Should not let user stake amount greater than user balance", async function(){
        await expect(stake.connect(addr1).stakeTokens(KOLtoken.address, web3.utils.toWei("100.000000000000000001"))).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should not let user stake amount greater than user balance", async function(){
        await expect(stake.connect(addr1).stakeTokens(KOLtoken.address, web3.utils.toWei("101"))).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    }); 

    // it("Should not user stake negative amount", async function(){  //idk output for negative numbers
    //     await expect(stake.connect(addr1).stakeTokens(KOLtoken.address, web3.utils.toWei("-1"))).to.be.revertedWith("big number"); //out of bound issue
    // });

    it("Should increase staking contract balance when any user stakes amount", async function(){ //idk how to check balance of contract
        const tx10 = await KOLtoken.balanceOf(stake.address);
        //console.log(stake.address);
        //owner = 100
        //addr2 = 0.000000000000000001
        //total = 100.000000000000000001
        console.log("balance of staking contract", web3.utils.fromWei(tx10.toString()));
        await stake.stakeTokens(KOLtoken.address, web3.utils.toWei("1.1"));
        const tx11 = await KOLtoken.balanceOf(stake.address);
        console.log("balance of staking contract after staking more", ethers.utils.formatEther(tx11));
    });

    it("Should verify when 2 users stake with equal weight", async function(){
        const tx16 = await stake._balances(owner.address);
        console.log("how much owner has staked", ethers.utils.formatEther(tx16));
        const tx18 = await stake._balances(addr2.address);
        console.log("how much user2 has staked", ethers.utils.formatEther(tx18));

    });

    // it("Should not let user Unstake 0 amount, here checking user balance", async function(){
    //     const tx12 = await KOLtoken.balanceOf(owner.address);
    //     console.log("balance of user before unstaking", ethers.utils.formatEther(tx12));
    //     await stake.withDraw(KOLtoken.address, web3.utils.toWei("1.1"));
    //     const tx13 = await KOLtoken.balanceOf(owner.address);
    //     console.log("balance of user after unstaking", ethers.utils.formatEther(tx13));
    // });

    it("Should not let user Unstake 0 amount", async function(){
        const tx12 = await KOLtoken.balanceOf(stake.address);
        console.log("balance of staking contract before unstaking", ethers.utils.formatEther(tx12));
        await expect(stake.withDraw(KOLtoken.address, web3.utils.toWei("0"))).to.be.revertedWith("AZ");
        const tx13 = await KOLtoken.balanceOf(stake.address);
        console.log("balance of staking contract after unstaking", ethers.utils.formatEther(tx13));
    });

    it("Should let user Unstake decimal amount", async function(){
        const tx14 = await KOLtoken.balanceOf(stake.address);
        console.log("balance of staking contract before unstaking", ethers.utils.formatEther(tx14));
        await stake.withDraw(KOLtoken.address, web3.utils.toWei("1.1"));
        const tx15 = await KOLtoken.balanceOf(stake.address);
        console.log("balance of staking contract after unstaking", ethers.utils.formatEther(tx15));
    });

    it("Should not let user Unstake more than staked amount", async function(){
        const tx19 = await stake._balances(owner.address);
        console.log("how much owner has staked", ethers.utils.formatEther(tx19));
       
        const tx20 = await KOLtoken.balanceOf(stake.address);
        console.log("balance of staking contract after unstaking", ethers.utils.formatEther(tx20));

        await expect(stake.withDraw(KOLtoken.address, web3.utils.toWei("100.000000000000000001"))).to.be.revertedWith("Invalid Amount");
    });
});