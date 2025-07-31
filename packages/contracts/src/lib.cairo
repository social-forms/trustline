#[starknet::contract]
mod IntegrityCheck {
    use starknet::storage::Map;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StorageMapWriteAccess;

    #[storage]
    struct Storage {
        fingerprints: Map<felt252, bool>,
    }

    #[abi(embed_v0)]
    impl IIntegrityCheck of super::IIntegrityCheck<ContractState> {
        fn store_fingerprint(ref self: ContractState, fingerprint: felt252) {
            assert(!self.fingerprints.read(fingerprint), 'Fingerprint already exists');
            self.fingerprints.write(fingerprint, true);
        }

        fn verify_fingerprint(self: @ContractState, fingerprint: felt252) -> bool {
            self.fingerprints.read(fingerprint)
        }
    }
}

#[starknet::interface]
trait IIntegrityCheck<TContractState> {
    fn store_fingerprint(ref self: TContractState, fingerprint: felt252);
    fn verify_fingerprint(self: @TContractState, fingerprint: felt252) -> bool;
}
