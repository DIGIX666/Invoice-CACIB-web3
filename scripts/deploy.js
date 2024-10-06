async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Vérification du solde du compte deployer
  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  // Déploiement du contrat InvoiceNFT
  const InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
  const invoiceNFT = await InvoiceNFT.deploy();
  await invoiceNFT.deployed(); // Attente de l'achèvement du déploiement
  console.log("InvoiceNFT contract deployed to:", invoiceNFT.address);
  
  // Deploy the PayInvoice contract
  const PayInvoice = await ethers.getContractFactory("PaymentWithSoCash");
  const payInvoice = await PayInvoice.deploy(invoiceNFT.address, '0xE915e34bF6D169bDE3A6DE84ad9D6E1a205Bce4d', '0x7001d5D92c9EbcbFF5c6bE3E9dd855cffb353e00');
  await payInvoice.deployed(); // Attente de l'achèvement du déploiement
  console.log("PayInvoice contract deployed to:", payInvoice.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
