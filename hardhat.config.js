require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.20",
  networks: {
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [
        `92bf52ddf436778c008f3ed9f3e84fd66eda2e2779dfe089526c7ce91119a1c2`,
      ], // Remplacez par votre clé privée
    },
    // mainnet: {
    //   url: `https://api.avax.network/ext/bc/C/rpc`,
    //   accounts: [``], // Clé privée sur le mainnet Avalanche
    // },
  },
};
