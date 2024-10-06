// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract InvoiceNFT is ERC721URIStorage {
    uint256 private _nextTokenId;

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

    event InvoiceCreated(uint256 indexed invoiceId, address indexed client, address indexed creator, uint256 amount, uint256 dueDate);
    event InvoicePaid(uint256 indexed invoiceId, address indexed client);

    constructor() ERC721("InvoiceNFT", "INVNFT") {
        _nextTokenId = 1;
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
        uint256 newItemId = _nextTokenId;
        _nextTokenId++;

        invoices[newItemId] = Invoice({
            id: newItemId,
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

        _safeMint(_client, newItemId);
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Facture #',
                        Strings.toString(newItemId),
                        '", "description": "',
                        _description,
                        '", "attributes": [{"trait_type": "Montant", "value": "',
                        Strings.toString(_amount),
                        ' ',
                        _currency,
                        '"}, {"trait_type": "Statut", "value": "Emis"}]}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _setTokenURI(newItemId, finalTokenUri);

        emit InvoiceCreated(newItemId, _client, msg.sender, _amount, _dueDate);
        return newItemId;
    }

    function markAsPaid(uint256 _invoiceId) public {
        require(msg.sender == invoices[_invoiceId].creator, "Seul le createur de la facture peut la marquer comme payee");
        require(invoices[_invoiceId].status != InvoiceStatus.Paye, "La facture est deja payee.");
        invoices[_invoiceId].status = InvoiceStatus.Paye;
        emit InvoicePaid(_invoiceId, invoices[_invoiceId].client);
    }
    // TODO: FIX this for use isInvoiceCreator and provider address
    function getInvoiceDetails(uint256 _invoiceId) public view returns (Invoice memory) {
        require(_exists(_invoiceId), "Le NFT de cette facture n'existe pas");

        // require(isInvoiceCreator(_invoiceId, msg.sender), "Vous n'etes pas autorise a voir les details de cette facture");

        return invoices[_invoiceId];
    }

    function isInvoiceCreator(uint256 _invoiceId, address _address) public view returns (bool) {
        return invoices[_invoiceId].creator == _address;
    }

    function getInvoiceStatus(uint256 _invoiceId) public view returns (InvoiceStatus) {
        require(_exists(_invoiceId), "Le NFT de cette facture n'existe pas");
        return invoices[_invoiceId].status;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
