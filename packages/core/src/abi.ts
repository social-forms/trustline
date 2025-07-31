export const abi = [
  {
    "type": "impl",
    "name": "IIntegrityCheck",
    "interface_name": "trustline_contracts::IIntegrityCheck"
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "trustline_contracts::IIntegrityCheck",
    "items": [
      {
        "type": "function",
        "name": "store_fingerprint",
        "inputs": [
          {
            "name": "fingerprint",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "verify_fingerprint",
        "inputs": [
          {
            "name": "fingerprint",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "event",
    "name": "trustline_contracts::IntegrityCheck::Event",
    "kind": "enum",
    "variants": []
  }
];
