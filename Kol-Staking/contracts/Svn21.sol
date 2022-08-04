// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SEVEN21 is ERC721 {
    constructor() ERC721("SEVEN21", "SVN21") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }
    function transfer(address from, address to, uint256 tokenId) external {
        _transfer(from, to, tokenId);
    }

    // function to get the max uint
    // function getMaxUint() public pure returns(uint256){
    //     unchecked{
    //         return uint256(0) - 1;  // it will return 78 digit number
    //     }
    // }    
}
