require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [process.env.PRIVATE_KEY], // Remplacez par votre clé privée
    },
    // mainnet: {
    //   url: `https://api.avax.network/ext/bc/C/rpc`,
    //   accounts: [``], // Clé privée sur le mainnet Avalanche
    // },
  },
};
