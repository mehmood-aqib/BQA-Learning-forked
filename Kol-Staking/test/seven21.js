//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const provider = waffle.provider;

const mymeta = '0x287cf34b46797570c74bd367dc081b57d2a52a88'

describe('ERC-721 Test Suite', () => {
    describe('00- Deploy token', () => {
        it("0.1- Deploy SVN21 token", async function () {
            // getting KOLNET token contract 
            let tok = await ethers.getContractFactory("SEVEN21");

            // deploying token
            token = await tok.deploy();

            // waiting for the token to deploy
            await token.deployed();

            // console.log('Yeh SVN21 token ha ',token.address);

        });

    });

    describe.skip('01- Minting token testcases', () => {
        it("1.1- Minting SVN21 token", async function () {
            [owner, addr1, addr2, ...addrs] = await provider.getWallets();

            // minting token on the owner address
            await token.mint(owner.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
            await token.mint(owner.address, '0');
            await token.mint(owner.address, '1');
            // console.log(owner.address)
        })
    })


    describe.skip('02- Tokens information testcases', () => {
        it("2.1- token name", async function () {
            const name = await token.name()
            const symbol = await token.symbol()
            console.log(`Token Name = ${name} \nToken Symbol = ${symbol}`)
        })

        it("2.2- Token URI", async function () {
            let tokenuri = await token.tokenURI('0')
            console.log("base URI= ", tokenuri)
        })
    })


    describe.skip('03- Balance of owner testcases', () => {
        it("3.1- Balance of owner", async function () {
            let bo = await token.balanceOf(mymeta)
            console.log(bo)
        })
    })


    describe.skip('04- Owner of token testcases', () => {
        it("4.1- Balance of owner", async function () {

            let ow = await expect(token.ownerOf('321')).to.be.revertedWith('invalid token ID')  // owner of tokenid 123
            // console.log(ow)

            let ow1 = await token.ownerOf('0')
            console.log(ow1)

        })
    })

    describe.skip('05- Approved token testcases', () => {
        it("5.1- Giving token approval", async function () {
            // giving token approval to the address
            const approval2 = await token.approve(addr1.address, '1')
            // console.log(approval)
            console.log("address 1 = ", addr1.address)

        })
    })


    describe.skip('06- Checking the token approval testcases', () => {
        it("6.1-  Owner of the token", async function () {
            // checking the approval status of the token
            const getapproved = await token.getApproved('0')
            console.log('checking ownership', getapproved)

        })
    })



    describe.skip('07- Set approval for all token testcases', () => {
        it("7.1- Giving token approval for all", async function () {
            // give approval for all tokens to the address
            const aprroveall = await token.setApprovalForAll(addr2.address, true)
            console.log(aprroveall)

        })
    })


    describe.skip('08- Check approval for all token testcases', () => {
        it("8.1- Check token approval for all", async function () {
            // check the approval for all tokens given to address or not
            const checkapproveall = await token.isApprovedForAll(owner.address, addr2.address)
            console.log(checkapproveall)

        })
    })


    describe.skip('09- Transfer testcases', () => {
        it("9.1- Transfer function", async function () {
            // simple transfer function
            const tx = await token.transfer(owner.address, mymeta, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
            // console.log(tx)

        })
    })


    describe.skip('10- TransferFrom testcases', () => {
        it("10.1- Tansfer from function", async function () {
            // transferFrom is working without giving token approval to owner
            const transferfrom = await token.transferFrom(owner.address, addr1.address, '1')
            // console.log(transferfrom)

            // // the below code is not giving approval to address1
            // const approval3 = await token.approve(addr1.address, '0')
            // const transferfrom2 = await token.transferFrom(addr1.address, owner.address, '0')


            // after transfer the ownership of the token will change
            // let ownr = await token.ownerOf('1')
            // console.log(ownr) 

        })
    })


    describe.skip('11- Burn token testcases', () => {
        it("11.1- Normal token burn", async function () {
            const bu = await token.burn('0')
            // console.log(bu)
        })
    })
})