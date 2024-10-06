// const fs = require('fs'); 
// const { ethers } = require('ethers');

// const clientAccount = JSON.parse(fs.readFileSync('./front/src/soAccounts/clientAccount.json', 'utf8'));
// const providerAccount = JSON.parse(fs.readFileSync('./front/src/soAccounts/providerAccount.json', 'utf8'));

// const paymentContractArtifact = JSON.parse(fs.readFileSync('./front/src/paymentWithSoCash.json', 'utf8'));
// const paymentContractABI = paymentContractArtifact.abi; 


// console.log("Client Account Address: ", clientAccount.accountAddress);
// console.log("Provider Account Address: ", providerAccount.accountAddress);

// async function payInvoiceWithSoCash(invoiceId, amount) {
//     const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc"); 
//     const signer = provider.getSigner();

//     const paymentContractAddress = "0xE915e34bF6D169bDE3A6DE84ad9D6E1a205Bce4d";  
    
//     const paymentContract = new ethers.Contract(paymentContractAddress, paymentContractABI, signer);

    
//     const tx = await paymentContract.payInvoice(
//         invoiceId, 
//         ethers.utils.parseEther(amount),  
//         "ETH",                            
//         {
//             from: clientAccount.accountAddress  
//         }
//     );

//     // Attendre la confirmation de la transaction
//     await tx.wait();

//     console.log("Transaction réussie :", tx);
// }

// // Exemple d'appel de la fonction avec l'ID de la facture et le montant en ETH
// payInvoiceWithSoCash(1, "0.1");