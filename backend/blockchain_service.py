import os
import json
from web3 import Web3

MST_RPC = "https://testnetrpc.mstblockchain.com"

CONTRACT_ADDRESS = "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48"

ABI_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "blockchain",
    "abi",
    "MedLedger.json"
)

with open(ABI_PATH, "r", encoding="utf-8") as f:
    ABI = json.load(f)

w3 = Web3(Web3.HTTPProvider(MST_RPC))

contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=ABI
)

print("MST connected:", w3.is_connected())
print("Contract:", CONTRACT_ADDRESS)