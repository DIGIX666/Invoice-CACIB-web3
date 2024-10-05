// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC1155 {
    uint256 public currentInvoiceId = 1;

    enum InvoiceStatus { Emis, Paye }

    struct Invoice {
        uint256 id;
        string issuer;
        string recipient;
        string description;
        uint256 amount;
        string currency;
        InvoiceStatus status;
        uint256 dueDate;
        string paymentInfo;
        uint256 issueDate;
        address soCashAccount;
    }

    mapping(uint256 => Invoice) public invoices;
    mapping(uint256 => address) public invoiceCreators;

    event InvoiceCreated(uint256 indexed invoiceId, address indexed creator, uint256 nftId);
    event InvoicePaid(uint256 indexed invoiceId, address indexed creator, address indexed payer, uint256 amount);
    event InvoiceUpdated(uint256 indexed invoiceId, address indexed updater);

    constructor() 
        ERC1155("https://api.example.com/metadata/{id}.json")
    {}

    function createInvoice(
    string memory _issuer,
    string memory _recipient,
    string memory _description,
    uint256 _amount,
    string memory _currency,
    uint256 _dueDate,
    string memory _paymentInfo,
    address[] memory _destinataires
) public {
        uint256 invoiceId = currentInvoiceId;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            issuer: _issuer,
            recipient: _recipient,
            description: _description,
            amount: _amount,
            currency: _currency,
            status: InvoiceStatus.Emis,
            dueDate: _dueDate,
            paymentInfo: _paymentInfo,
            issueDate: block.timestamp,
            soCashAccount: address(0)
        });

        invoiceCreators[invoiceId] = msg.sender;
        
        // Mint pour le créateur
        _mint(msg.sender, invoiceId, 1, "");

        // Mint pour les destinataires supplémentaires
    for (uint256 i = 0; i < _destinataires.length; i++) {
        if (_destinataires[i] != msg.sender) {
            _mint(_destinataires[i], invoiceId, 1, "");
        }
    }
        currentInvoiceId++;
        emit InvoiceCreated(invoiceId, msg.sender, invoiceId);
    }

    function markAsPaid(uint256 _invoiceId) public {
        require(msg.sender == invoiceCreators[_invoiceId], "Seul le createur de la facture peut la marquer comme payee");
        require(invoices[_invoiceId].status != InvoiceStatus.Paye, "La facture est deja payee.");
        invoices[_invoiceId].status = InvoiceStatus.Paye;
        emit InvoicePaid(_invoiceId, msg.sender, msg.sender, invoices[_invoiceId].amount);
    }

    
function mintMoreCopies(uint256 _invoiceId, uint256 _amount) public {
    require(msg.sender == invoiceCreators[_invoiceId], "Seul le createur de la facture peut minter plus de copies");
    _mint(msg.sender, _invoiceId, _amount, "");
}
    function getInvoiceDetails(uint256 _invoiceId) public view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
    function setSoCashAccount(uint256 _invoiceId, address _soCashAccount) public {
    require(msg.sender == invoiceCreators[_invoiceId], unicode"Seul le createur de la facture peut définir le compte so|cash");
    invoices[_invoiceId].soCashAccount = _soCashAccount;
}

}


interface ISoCash {
    function transfer(address recipient, uint256 amount) external;
}

contract InvoicePayment {
    address public invoiceNFTContract;
    uint256 public invoiceId;
    address public soCashAccountPayer;
    address public soCashAccountProvider;

    constructor(address _invoiceNFTContract, uint256 _invoiceId, address _soCashAccountProvider) {
        invoiceNFTContract = _invoiceNFTContract;
        invoiceId = _invoiceId;
        soCashAccountProvider = _soCashAccountProvider;
    }

    function setPayerAccount(address _soCashAccountPayer) external {
        soCashAccountPayer = _soCashAccountPayer;
    }

    function payInvoice() external {
    require(soCashAccountPayer != address(0), unicode"Le compte du payeur so|cash n'est pas défini.");
    require(soCashAccountProvider != address(0), unicode"Le compte du fournisseur so|cash n'est pas défini.");

    // Appel au contrat so|cash pour effectuer le transfert
    ISoCash(soCashAccountPayer).transfer(soCashAccountProvider, invoiceId);
    
    // Marquer la facture comme payée
    InvoiceNFT(invoiceNFTContract).markAsPaid(invoiceId);
}

}
