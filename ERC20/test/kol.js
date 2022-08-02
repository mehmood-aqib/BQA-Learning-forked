//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const my_Address = '0x08cDc925bEb97f689a63da01E35C195a80e1998d';
const provider = waffle.provider; 
describe('Test Suite', () => {
    it("1.1 token deploy", async function () {
        // [owner, addr1, addr2, ...addrs] = await provider.getWallets();
        const tok = await ethers.getContractFactory("KOLNET");
        token = await tok.deploy();
        await token.deployed();
        const project = await ethers.getContractFactory("KOLNET");
        _erc20 = await project.deploy();
        // stake = await pro.deploy(owner.address, token.address);
        await _erc20.deployed();
        console.log('I am here')
    });

    it("2.1 Minting Kol token", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();
        await token.mint(owner.address, web3.utils.toWei("7000")); //minitng 7000 KOLNET Tokens
        await token.approve(owner.address, web3.utils.toWei("8000"));  //approving on owner address
        console.log('KOL Token Address',token.address);
    });

    it("3.1 Burning Kol token", async function () {
        const burn = await token.burn(web3.utils.toWei("1000")); //Burning 1000 kol tokens => 7000 - 1000 = 6000
        //console.log(burn);
        const tx1 = await token.balanceOf(owner.address);  //checking balance of owner
        console.log("balance of owner", web3.utils.fromWei(tx1.toString()));
    });

    it("3.2 Burning Kol token that is greater then users current amount", async function () {
        await expect(token.burn(web3.utils.toWei("9000"))).to.be.revertedWith('ERC20: burn amount exceeds balance'); //Burning 9000 kol tokens 
    });

    it("3.3 Burning 0 Kol token", async function () {
        await token.burn(web3.utils.toWei("0")); //Burned 0 hence test case Fail
    });

    it("3.4 Burning -1 Kol token", async function () {
        await expect(token.burn(web3.utils.toWei("-1"))).to.be.reverted;
    });

    it("4.1 Transfer kol token", async function () {
        await token.transfer(my_Address,web3.utils.toWei("500")); //Transfering 500 kol tokens => 6000 - 5000 = 5500
        const tx1 = await token.balanceOf(owner.address);  //checking balance of owner
        console.log("balance of owner", web3.utils.fromWei(tx1.toString()));

        const tx2 = await token.balanceOf(my_Address); //checking balance of receiver
        console.log("balance of receiver", web3.utils.fromWei(tx2.toString())); //should be 500
    });

    it("4.2 Transfer kol token greater than existing balance", async function () {
        await expect(token.transfer(my_Address,web3.utils.toWei("9500"))).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });

    it("4.3 Transfer 0 kol token", async function () {
        await token.transfer(my_Address,web3.utils.toWei("0")); //Transfered 0 hence test case Fail
    });

    it("4.4 Transfer -1 kol token", async function () {
        await expect(token.transfer(my_Address,web3.utils.toWei("-1"))).to.be.reverted;
    });

    it("4.5 Transfer kol token in decimals", async function () {
        await token.transfer(my_Address,web3.utils.toWei("0.666666")); 
        //Transfering 0.666666 kol tokens => 5500 - 0.6666666 = 5499.333334
        const tx1 = await token.balanceOf(owner.address);  //checking balance of owner
        console.log("balance of owner", web3.utils.fromWei(tx1.toString()));

        const tx2 = await token.balanceOf(my_Address); //checking balance of receiver
        console.log("balance of receiver", web3.utils.fromWei(tx2.toString())); //should be 500.666664
    });

    it("4.6 Transfer kol token with multiple dots", async function () {
        // await (token.transfer(my_Address,web3.utils.toWei("22.33.44")))  
        // compile time error so can not use expect to pass this test case
    });

    it("4.7 Transfer kol token with dot at the end", async function () {
        await token.transfer(my_Address,web3.utils.toWei("44.")); 
        //transfered with dot at the end hence test case Fail
        
        //Transfering 44. kol tokens => 5499.333334 - 44 = 5455.333334
        const tx1 = await token.balanceOf(owner.address);  //checking balance of owner
        console.log("balance of owner", web3.utils.fromWei(tx1.toString()));

        const tx2 = await token.balanceOf(my_Address); //checking balance of receiver
        console.log("balance of receiver", web3.utils.fromWei(tx2.toString())); //should be 544.66666
    });

    it("5.1 Balance of Any address", async function () {
        const bal = await token.balanceOf(owner.address)
        console.log('Owner: ', bal); //balance of owner 5455.333334 => 5455333334000000000000
        const bal1 = await token.balanceOf(my_Address)
        console.log('Receiver: ',bal1); // balance of receiver 544.666666 => 544666666000000000000
    });

    it("6.1 transferFrom function working", async function () {
        await token.transferFrom(owner.address, my_Address, web3.utils.toWei("1200"))

        //Transfering 1200 kol tokens => 5455.333334 - 1200 = 4255.333334
        const tx1 = await token.balanceOf(owner.address);  //checking balance of owner
        console.log("balance of owner", web3.utils.fromWei(tx1.toString()));
        
        const tx2 = await token.balanceOf(my_Address); //checking balance of receiver
        console.log("balance of receiver", web3.utils.fromWei(tx2.toString())); //should be 544.66666 + 1200 = 1744.6666
    });

    it("6.2 transferFrom function while sending amount greater then approved allowance", async function () {
        await expect(token.transferFrom(owner.address, my_Address, web3.utils.toWei("8000"))).to.be.revertedWith('ERC20: insufficient allowance')
    });

    it("6.3 transferFrom function while sending amount greater then user balance but less than approved allowance", async function () {
        await expect(token.transferFrom(owner.address, my_Address, web3.utils.toWei("5000"))).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    });

    it("6.4 transferFrom function while sending amount 0", async function () {
        await token.transferFrom(owner.address, my_Address, web3.utils.toWei("0")) //Transfered 0 hence test case Fail
    });

    it("7.1 Total supply", async function () {
        const tx = await token.totalSupply()
        console.log(web3.utils.fromWei(tx.toString()));
        
    });
    
    it("8.1 Token Decimal", async function () {
        const token_dec = await token.decimals();
        console.log(token_dec);
    });

    it("9.1 Allownce checking", async function () {
        await token.approve(my_Address, web3.utils.toWei("3333"));
        const allownce_check = await token.allowance(owner.address, my_Address);
        console.log(web3.utils.fromWei(allownce_check.toString()));
    });

    it("10.1 Increase Allownce", async function () {
        const allownce_increase = await token.increaseAllowance(my_Address, web3.utils.toWei("500"));
        // console.log(allownce_increase);
        const allownce_check = await token.allowance(owner.address, my_Address);
        console.log(web3.utils.fromWei(allownce_check.toString()));
    });

    it("11.1 Decrease Allownce", async function () {
        const allownce_decrease = await token.decreaseAllowance(my_Address, web3.utils.toWei("300"));
        // console.log(allownce_decrease);
        const allownce_check = await token.allowance(owner.address, my_Address);
        console.log(web3.utils.fromWei(allownce_check.toString()));
    });
})