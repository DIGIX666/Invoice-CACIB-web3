// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../so|cash/src/impl/so-cash-account-impl.sol";
import "../so|cash/src/impl/so-cash-bank-impl.sol";
import "../so|cash/src/intf/so-cash-types.sol"; 
import "./InvoiceNFT.sol";

contract PaymentWithSoCash {
    address public invoiceContractAddress;  // Address of the InvoiceNFT contract
    SoCashAccount public soCashClientAccount;  // Address of the client's so|cash account
    SoCashAccount public soCashProviderAccount;   // Address of the provider's so|cash account

    constructor(address _invoiceContractAddress, address _soCashClientAccount, address _soCashProviderAccount) {
        invoiceContractAddress = _invoiceContractAddress;
        soCashClientAccount = SoCashAccount(_soCashClientAccount); 
        soCashProviderAccount = SoCashAccount(_soCashProviderAccount); 
    }

    event PaymentExecuted(uint256 invoiceId, uint256 amount, string currency);

    // Function to pay an invoice
    function payInvoice(uint256 invoiceId, uint256 amount, string memory currency) public {

        // Build the recipient info
        RecipentInfo memory recipient = RecipentInfo({
            account: soCashProviderAccount,  // Address of the provider's so|cash account
            bic: BIC.wrap(0),          // Placeholder for the BIC
            iban: IBAN.wrap(0)          // Placeholder for the IBAN
    });

        // Call the transferEx function of the client's so|cash account
        require(soCashClientAccount.transferEx(recipient, amount, "Payment for Invoice"), "Payment failed");


        // Call the markAsPaid function of the InvoiceNFT contract
        InvoiceNFT(invoiceContractAddress).markAsPaid(invoiceId);

        emit PaymentExecuted(invoiceId, amount, currency);
    }
}
