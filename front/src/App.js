import React, { useState } from "react";
import { ethers, isAddress } from "ethers"; // Import d'ethers et des utilitaires nécessaires
import InvoiceNFT from "./InvoiceNFT.json"; // ABI du contrat

const contractAddress = "0xbEA1A08A0A6A061299508D2b01f11959aFC03fcE"; // Remplacez par l'adresse déployée

function App() {
  const [issuer, setIssuer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [dueDate, setDueDate] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [destinataires, setDestinataires] = useState("");

  const createInvoice = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        InvoiceNFT.abi,
        signer
      );

      if (isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Veuillez entrer un montant valide.");
        return;
      }

      const parsedAmount = ethers.parseUnits(amount, "ether");
      const parsedDueDate = Math.floor(new Date(dueDate).getTime() / 1000);

      console.log("Données envoyées au contrat:", {
        _issuer: issuer,
        _recipient: recipient,
        _description: description,
        _amount: parsedAmount.toString(),
        _currency: currency,
        _dueDate: parsedDueDate,
        _paymentInfo: paymentInfo,
      });

      const destinatairesArray = destinataires
        .split(",")
        .map((addr) => addr.trim());

      // Vérifiez que toutes les adresses sont valides
      if (!destinatairesArray.every((addr) => isAddress(addr))) {
        alert(
          "Une ou plusieurs adresses de destinataires ne sont pas valides."
        );
        return;
      }

      const tx = await contract.createInvoice(
        issuer,
        recipient,
        description,
        parsedAmount,
        currency,
        parsedDueDate,
        paymentInfo,
        destinatairesArray
      );

      await tx.wait();
      console.log("Facture créée :", tx);
      alert("Facture créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      alert("Erreur lors de la création de la facture: " + error.message);
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
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            disabled
          />
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
        <div>
          <label>
            Adresses des destinataires (séparées par des virgules si plusieurs):
          </label>
          <input
            type="text"
            value={destinataires}
            onChange={(e) => setDestinataires(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer la Facture</button>
      </form>
    </div>
  );
}

export default App;
