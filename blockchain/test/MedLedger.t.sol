// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import {Test} from "forge-std/Test.sol";
import {MedLedger} from "../contracts/MedLedger.sol";

contract MedLedgerTest is Test {
    MedLedger ledger;

    string equipmentId = "EQ-00042";

    bytes32 originalHash =
        0x1111111111111111111111111111111111111111111111111111111111111111;

    bytes32 modifiedHash =
        0x2222222222222222222222222222222222222222222222222222222222222222;

    function setUp() public {
        ledger = new MedLedger();
    }

    function testRegisterCertificate() public {
        ledger.registerCertificate(equipmentId, originalHash);

        (
            bytes32 storedHash,
            uint256 registeredAt,
            bool exists
        ) = ledger.getCertificate(equipmentId);

        assertEq(storedHash, originalHash);
        assertGt(registeredAt, 0);
        assertTrue(exists);
    }

    function testVerifyMatchingCertificate() public {
        ledger.registerCertificate(equipmentId, originalHash);

        bool result = ledger.verifyCertificate(
            equipmentId,
            originalHash
        );

        assertTrue(result);
    }

    function testRejectModifiedCertificate() public {
        ledger.registerCertificate(equipmentId, originalHash);

        bool result = ledger.verifyCertificate(
            equipmentId,
            modifiedHash
        );

        assertFalse(result);
    }

    function testUpdateCertificate() public {
        ledger.registerCertificate(equipmentId, originalHash);

        ledger.updateCertificate(
            equipmentId,
            modifiedHash
        );

        (
            bytes32 storedHash,
            ,
            bool exists
        ) = ledger.getCertificate(equipmentId);

        assertEq(storedHash, modifiedHash);
        assertTrue(exists);
    }

    function testCannotRegisterTwice() public {
        ledger.registerCertificate(equipmentId, originalHash);

        vm.expectRevert("Certificate already registered");

        ledger.registerCertificate(
            equipmentId,
            modifiedHash
        );
    }

    function testCannotUpdateUnknownEquipment() public {
        vm.expectRevert("Certificate not registered");

        ledger.updateCertificate(
            equipmentId,
            modifiedHash
        );
    }
}