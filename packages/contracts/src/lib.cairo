#[starknet::interface]
trait IIntegrityCheck<TContractState> {
    fn store_fingerprint(ref self: TContractState, fingerprint: felt252);
    fn verify_fingerprint(self: @TContractState, fingerprint: felt252) -> bool;
    fn get_nonce(self: @TContractState, signer_public_key: felt252) -> felt252;
}

#[starknet::interface]
trait IRelayedStore<TContractState> {
    fn store_fingerprint_relayed(
        ref self: TContractState,
        signer_public_key: felt252,
        fingerprint: felt252,
        signature: Span<felt252>
    );
}

#[starknet::contract]
mod IntegrityCheck {
    use starknet::storage::Map;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StorageMapWriteAccess;
    use starknet::{get_tx_info, get_caller_address};
    use core::hash::{HashStateTrait};
    use core::pedersen::PedersenTrait;
    use core::ecdsa::check_ecdsa_signature;
    use core::array::SpanTrait;

    #[storage]
    struct Storage {
        fingerprints: Map<felt252, bool>,
        nonces: Map<felt252, felt252>,
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

        fn get_nonce(self: @ContractState, signer_public_key: felt252) -> felt252 {
            self.nonces.read(signer_public_key)
        }
    }

    #[abi(embed_v0)]
    impl RelayedStore of super::IRelayedStore<ContractState> {
        fn store_fingerprint_relayed(
            ref self: ContractState,
            signer_public_key: felt252,
            fingerprint: felt252,
            mut signature: Span<felt252>
        ) {
            let tx_info = get_tx_info().unbox();
            let nonce = self.nonces.read(signer_public_key);

            let mut hasher = PedersenTrait::new(0);
            hasher = hasher.update(tx_info.chain_id);
            hasher = hasher.update(get_caller_address().into());
            hasher = hasher.update('store_fingerprint');
            hasher = hasher.update(signer_public_key);
            hasher = hasher.update(fingerprint);
            hasher = hasher.update(nonce);
            let message_hash = hasher.finalize();

            let r = *signature.pop_front().unwrap();
            let s = *signature.pop_front().unwrap();

            assert(
                check_ecdsa_signature(message_hash, signer_public_key, r, s),
                'Invalid signature'
            );

            assert(!self.fingerprints.read(fingerprint), 'Fingerprint already exists');
            self.fingerprints.write(fingerprint, true);
            self.nonces.write(signer_public_key, nonce + 1);
        }
    }
}
