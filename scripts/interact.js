// const fs = require('fs'); 
// const { ethers } = require('ethers');
// require("dotenv").config();

// const clientAccount = JSON.parse(fs.readFileSync('./front/src/soAccounts/clientAccount.json', 'utf8'));
// const providerAccount = JSON.parse(fs.readFileSync('./front/src/soAccounts/providerAccount.json', 'utf8'));

// // Charger le fichier ABI du contrat
// const paymentContractArtifact = JSON.parse(fs.readFileSync('./front/src/PaymentWithSoCash.json', 'utf8'));
// const paymentContractABI = paymentContractArtifact.abi; 

// console.log("Client Account Address: ", clientAccount.accountAddress);
// console.log("Provider Account Address: ", providerAccount.accountAddress);

// // Fonction pour payer une facture avec so|cash
// async function payInvoiceWithSoCash(invoiceId, amount) {
//     const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc"); 

    
//     const clientPrivateKey = clientAccount.privateKey;
//     const signer = new ethers.Wallet(clientPrivateKey, provider);

//     const paymentContractAddress = "0x0e2c5edb1C3c9bE62633f8e6DEe7Cf7875dCD3cd";  
//     const paymentContract = new ethers.Contract(paymentContractAddress, paymentContractABI, signer);

//     // Préparer et envoyer la transaction
//     const tx = await paymentContract.payInvoice(
//         invoiceId, 
//         ethers.utils.parseEther(amount),  
//         "ETH"
//     );


//     await tx.wait();

//     console.log("Transaction réussie :", tx);
// }

// payInvoiceWithSoCash(1, "0.1");