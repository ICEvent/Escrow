import Array    "mo:base/Array";
import Blob     "mo:base/Blob";
import Nat8     "mo:base/Nat8";
import Nat32    "mo:base/Nat32";

import Hex      "./hex";
import Types    "./types";

module {

    type AccountId = Types.AccountId;
    type AccountIdText = Types.AccountIdText;
    type Subaccount = Types.Subaccount;
    type SubaccountBlob = Types.SubaccountBlob;
    type SubaccountNat8Arr = Types.SubaccountNat8Arr;

    // Account helpers 

    public func accountIdToHex (a : AccountId) : AccountIdText {
        Hex.encode(Blob.toArray(a));
    };

    public func hexToAccountId (h : AccountIdText) : AccountId {
        Blob.fromArray(Hex.decode(h));
    };    

    public func defaultSubaccount () : SubaccountBlob {
        Blob.fromArrayMut(Array.init(32, 0 : Nat8))
    };

    public func natToBytes (n : Nat) : [Nat8] {
        nat32ToBytes(Nat32.fromNat(n));
    };

    public func nat32ToBytes (n : Nat32) : [Nat8] {
        func byte(n: Nat32) : Nat8 {
            Nat8.fromNat(Nat32.toNat(n & 0xff))
        };
        [byte(n >> 24), byte(n >> 16), byte(n >> 8), byte(n)]
    };

    public func subToSubBlob (sub : Subaccount) : SubaccountBlob {
        let n_byte = func(i : Nat) : Nat8 {
            assert(i < 32);
            let shift : Nat = 8 * (32 - 1 - i);
            Nat8.fromIntWrap(sub / 2**shift)
        };
        Blob.fromArray(Array.tabulate<Nat8>(32, n_byte))
    };

    public func subBlobToSubNat8Arr (sub : SubaccountBlob) : SubaccountNat8Arr {
        let subZero : [var Nat8] = [var 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        let subArray = Blob.toArray(sub);
        let sizeDiff = subZero.size()-subArray.size();
        var i = 0;
        while (i < subZero.size()) {
            if (i >= sizeDiff) {
                subZero[i] := subArray[i - sizeDiff];
            };
            i += 1;
        };
        Array.freeze<Nat8>(subZero);
    };

}