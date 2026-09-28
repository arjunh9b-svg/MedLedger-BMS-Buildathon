// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract MedLedger {
    struct Certificate {
        bytes32 certificateHash;
        uint256 registeredAt;
        bool exists;
    }

    mapping(string => Certificate) private certificates;

    event CertificateRegistered(
        string indexed equipmentId,
        bytes32 certificateHash,
        uint256 timestamp
    );

    event CertificateVerified(
        string indexed equipmentId,
        bytes32 certificateHash,
        bool matched,
        uint256 timestamp
    );

    event CertificateUpdated(
        string indexed equipmentId,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 timestamp
    );

    function registerCertificate(
        string calldata equipmentId,
        bytes32 certificateHash
    ) external {
        require(bytes(equipmentId).length > 0, "Invalid equipment ID");
        require(certificateHash != bytes32(0), "Invalid certificate hash");
        require(
            !certificates[equipmentId].exists,
            "Certificate already registered"
        );

        certificates[equipmentId] = Certificate({
            certificateHash: certificateHash,
            registeredAt: block.timestamp,
            exists: true
        });

        emit CertificateRegistered(
            equipmentId,
            certificateHash,
            block.timestamp
        );
    }

    function verifyCertificate(
        string calldata equipmentId,
        bytes32 certificateHash
    ) external returns (bool) {
        Certificate memory certificate = certificates[equipmentId];

        bool matched =
            certificate.exists &&
            certificate.certificateHash == certificateHash;

        emit CertificateVerified(
            equipmentId,
            certificateHash,
            matched,
            block.timestamp
        );

        return matched;
    }

    function updateCertificate(
        string calldata equipmentId,
        bytes32 newCertificateHash
    ) external {
        require(bytes(equipmentId).length > 0, "Invalid equipment ID");
        require(newCertificateHash != bytes32(0), "Invalid certificate hash");
        require(
            certificates[equipmentId].exists,
            "Certificate not registered"
        );

        bytes32 oldHash = certificates[equipmentId].certificateHash;

        certificates[equipmentId].certificateHash = newCertificateHash;

        emit CertificateUpdated(
            equipmentId,
            oldHash,
            newCertificateHash,
            block.timestamp
        );
    }

    function getCertificate(
        string calldata equipmentId
    )
        external
        view
        returns (
            bytes32 certificateHash,
            uint256 registeredAt,
            bool exists
        )
    {
        Certificate memory certificate = certificates[equipmentId];

        return (
            certificate.certificateHash,
            certificate.registeredAt,
            certificate.exists
        );
    }
}