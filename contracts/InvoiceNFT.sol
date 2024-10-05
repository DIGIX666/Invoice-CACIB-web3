// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract InvoiceNFT is ERC721 {
    uint256 private lastTimestamp;

    struct Invoice {
        uint256 id;
        address client;
        address creator;
        string issuer;
        string description;
        uint256 amount;
        string currency;
        InvoiceStatus status;
        uint256 dueDate;
        string paymentInfo;
        uint256 issueDate;
    }

    enum InvoiceStatus { Emis, Paye }

    mapping(uint256 => Invoice) private invoices;

    event InvoiceCreated(uint256 indexed invoiceId, address indexed client, address indexed creator);
    event InvoicePaid(uint256 indexed invoiceId, address indexed client);

    constructor() ERC721("InvoiceNFT", "INVNFT") {
        lastTimestamp = block.timestamp;
    }

    function generateUniqueId() private returns (uint256) {
        uint256 currentTimestamp = block.timestamp;
        if (currentTimestamp <= lastTimestamp) {
            currentTimestamp = lastTimestamp + 1;
        }
        lastTimestamp = currentTimestamp;
        return currentTimestamp;
    }

    function createInvoice(
        address _client,
        string memory _issuer,
        string memory _description,
        uint256 _amount,
        string memory _currency,
        uint256 _dueDate,
        string memory _paymentInfo
    ) public returns (uint256) {
        uint256 invoiceId = generateUniqueId();
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            client: _client,
            creator: msg.sender,
            issuer: _issuer,
            description: _description,
            amount: _amount,
            currency: _currency,
            status: InvoiceStatus.Emis,
            dueDate: _dueDate,
            paymentInfo: _paymentInfo,
            issueDate: block.timestamp
        });

        _safeMint(_client, invoiceId);
        
        emit InvoiceCreated(invoiceId, _client, msg.sender);
        return invoiceId;
    }

    function markAsPaid(uint256 _invoiceId) public {
        require(msg.sender == invoices[_invoiceId].creator, "Seul le createur de la facture peut la marquer comme payee");
        require(invoices[_invoiceId].status != InvoiceStatus.Paye, "La facture est deja payee.");
        invoices[_invoiceId].status = InvoiceStatus.Paye;
        emit InvoicePaid(_invoiceId, invoices[_invoiceId].client);
    }

    function getInvoiceDetails(uint256 _invoiceId) public view returns (Invoice memory) {
        require(_exists(_invoiceId), "Le NFT de cette facture n'existe pas");
        require(msg.sender == ownerOf(_invoiceId) || msg.sender == invoices[_invoiceId].creator, "Vous n'etes pas autorise a voir les details de cette facture");
        return invoices[_invoiceId];
    }

    function isInvoiceCreator(uint256 _invoiceId, address _address) public view returns (bool) {
        return invoices[_invoiceId].creator == _address;
    }

    function getInvoiceStatus(uint256 _invoiceId) public view returns (InvoiceStatus) {
        require(_exists(_invoiceId), "Le NFT de cette facture n'existe pas");
        return invoices[_invoiceId].status;
    }
}
