import React, { useState } from "react";
import { ethers } from "ethers";
import InvoiceNFT from "./InvoiceNFT.json"; // ABI du contrat InvoiceNFT
import PaymentWithSoCash from './PaymentWithSoCash.json'; // ABI du contrat PaymentWithSoCash
import { formatUnits, parseUnits } from "ethers";

const contractAddress = "0x125D9dFDCA4100B8a3C3Fe8E5F87f6Ca4Df1B0Ec"; // Adresse du contrat InvoiceNFT
const paymentContractAddress = "0x0e2c5edb1C3c9bE62633f8e6DEe7Cf7875dCD3cd"; // Adresse du contrat PaymentWithSoCash

function App() {
  const [issuer, setIssuer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [dueDate, setDueDate] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState(null); 
  const [invoiceURI, setInvoiceURI] = useState(null);

  // Fonction pour créer une nouvelle facture
  const createInvoice = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, InvoiceNFT.abi, signer);

      if (isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Veuillez entrer un montant valide.");
        return;
      }

      const parsedAmount = parseUnits(amount, "ether");
      const parsedDueDate = Math.floor(new Date(dueDate).getTime() / 1000);

      const tx = await contract.createInvoice(
        recipient,
        issuer,
        description,
        parsedAmount,
        currency,
        parsedDueDate,
        paymentInfo
      );

      await tx.wait();
      console.log("Facture créée :", tx);
      alert("Facture créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      alert("Erreur lors de la création de la facture: " + error.message);
    }
  };

  // Fonction pour récupérer les détails d'une facture
  const getInvoiceDetails = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, InvoiceNFT.abi, provider);

      const invoice = await contract.getInvoiceDetails(invoiceId);
      setInvoiceDetails(invoice); // Stocker les détails de la facture

      // Obtenir le token URI du NFT de la facture
      const uri = await contract.tokenURI(invoiceId);
      setInvoiceURI(uri); // Stocker l'URI pour les métadonnées
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la facture:", error);
    }
  };

  // Fonction pour marquer une facture comme payée
  const markAsPaid = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, InvoiceNFT.abi, signer);

      const tx = await contract.markAsPaid(invoiceId);
      await tx.wait();
      console.log('Facture marquée comme payée:', tx);
      alert("La facture a été marquée comme payée !");
    } catch (error) {
      console.error('Erreur lors du paiement de la facture:', error);
      alert("Erreur lors du paiement de la facture: " + error.message);
    }
  };

  const payInvoiceWithSoCash = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const paymentContract = new ethers.Contract(paymentContractAddress, PaymentWithSoCash.abi, signer);
      
      // Conversion du montant en wei
      const parsedAmount = parseUnits(amount, "ether");

      // Appel de la fonction payInvoice
      const tx = await paymentContract.payInvoice(invoiceId, parsedAmount, currency);
      await tx.wait();

      console.log("Paiement effectué et facture marquée comme payée:", tx);
      alert("Paiement effectué et facture marquée comme payée !");
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      alert("Erreur lors du paiement: " + error.message);
    }
  };

  return (
    <div>
      <h1>Gestion des Factures NFT</h1>

      {/* Formulaire pour créer une nouvelle facture */}
      <form onSubmit={createInvoice}>
        <h2>Créer une nouvelle facture</h2>
        <div>
          <label>Émetteur (Nom du vendeur):</label>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Client (Nom du destinataire):</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description des services:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Montant (en ETH):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Devise:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="DAI">DAI</option>
          </select>
        </div>
        <div>
          <label>Date d'échéance:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Informations de paiement:</label>
          <input
            type="text"
            value={paymentInfo}
            onChange={(e) => setPaymentInfo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer la Facture</button>
      </form>

      {/* Formulaire pour récupérer les détails d'une facture */}
      <form onSubmit={getInvoiceDetails}>
        <h2>Récupérer les détails d'une facture</h2>
        <div>
          <label>ID de la facture:</label>
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Obtenir les détails</button>
      </form>

      {invoiceDetails && (
        <div>
          <h2>Détails de la facture</h2>
          <p>ID: {invoiceDetails.id.toString()}</p>
          <p>Émetteur: {invoiceDetails.issuer}</p>
          <p>Client: {invoiceDetails.client}</p>
          <p>Description: {invoiceDetails.description}</p>
          <p>Montant: {formatUnits(invoiceDetails.amount.toString(), 'ether')} {invoiceDetails.currency}</p>
          <p>Date d'émission: {new Date(Number(invoiceDetails.issueDate) * 1000).toLocaleString()}</p>
          <p>Date d'échéance: {new Date(Number(invoiceDetails.dueDate) * 1000).toLocaleString()}</p>
          <p>Statut: {invoiceDetails.status === 0 ? 'Émis' : 'Payé'}</p>
      </div>
      )}

      {invoiceURI && (
        <div>
          <h2>URI du NFT de la facture</h2>
          <a href={invoiceURI} target="_blank" rel="noopener noreferrer">
            Voir les métadonnées du NFT
          </a>
        </div>
      )}

      {/* Formulaire pour marquer une facture comme payée */}
      <form onSubmit={markAsPaid}>
        <h2>Marquer une facture comme payée</h2>
        <div>
          <label>ID de la facture à payer:</label>
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Marquer comme payée</button>
      </form>

      {/* Formulaire pour payer une facture via so|cash */}
      <form onSubmit={payInvoiceWithSoCash}>
        <h2>Payer une facture via so|cash</h2>
        <div>
          <label>ID de la facture à payer:</label>
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Montant (en ETH):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Payer via so|cash</button>
      </form>
    </div>
  );
}

export default App;
