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

  // Ajout d'une adresse soCashAccountProvider (à ajuster en fonction du contexte)
  const soCashAccountProvider = "0xYourSoCashAccountProviderAddressHere"; // Remplace par une adresse valide

  // Pour cet exemple, on définit un invoiceId manuellement (à ajuster en fonction du contexte)
  const invoiceId = 1;

  // Déploiement du contrat InvoicePayment avec les paramètres appropriés
  const InvoicePayment = await ethers.getContractFactory("InvoicePayment");
  const invoicePayment = await InvoicePayment.deploy(invoiceNFT.address, invoiceId, soCashAccountProvider);
  await invoicePayment.deployed(); // Attente de l'achèvement du déploiement
  console.log("InvoicePayment contract deployed to:", invoicePayment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
