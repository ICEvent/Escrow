import Array     "mo:base/Array";
import Blob      "mo:base/Blob";
import Nat8      "mo:base/Nat8";
import Nat32     "mo:base/Nat32";
import Principal "mo:base/Principal";
import Text      "mo:base/Text";

import CRC32     "./CRC32";
import SHA224    "./SHA224";
import Types     "./types";
import Utils     "./utils";

module {
    
    type AccountId      = Types.AccountId;
    type SubaccountBlob = Types.SubaccountBlob;

    public func getAccountId (principal: Principal, subaccount: SubaccountBlob) : AccountId {
        let hash = SHA224.Digest();
        hash.write([0x0A]);
        hash.write(Blob.toArray(Text.encodeUtf8("account-id")));
        hash.write(Blob.toArray(Principal.toBlob(principal)));
        hash.write(Blob.toArray(subaccount));
        let hashSum = hash.sum();
        let crc32Bytes = Utils.nat32ToBytes(CRC32.ofArray(hashSum));
        Blob.fromArray(Array.append(crc32Bytes, hashSum))
    };

    public func validateAccountId (accountId : AccountId) : Bool {
        if (accountId.size() != 32) {
            return false;
        };
        let a = Blob.toArray(accountId);
        let accIdPart    = Array.tabulate(28, func(i: Nat): Nat8 { a[i + 4] });
        let checksumPart = Array.tabulate(4,  func(i: Nat): Nat8 { a[i] });
        let crc32 = CRC32.ofArray(accIdPart);
        Array.equal(Utils.nat32ToBytes(crc32), checksumPart, Nat8.equal)
    };
}