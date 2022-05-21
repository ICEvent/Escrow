import Time "mo:base/Time";

module {

    public type AccountId           = Blob;
    public type AccountIdText       = Text;
    public type Subaccount          = Nat;
    public type SubaccountNat8Arr   = [Nat8];
    public type SubaccountBlob      = Blob;


    public type Order ={
        id: Nat;
        buyer: Principal;
        seller: Principal;
        memo: Text;
        amount: Nat64;
        account: Text;
        blockin: Nat64; 
        blockout: Nat64;
        createtime: Int;
        status:{
            #new;
            #deposited;
            #delivered;
            #released;
            #refunded;
            #closed;
            #canceled;
        };
        
        updatetime: Int;
        expiration: Int;
    };

    // LEDGER
    public type AccountBalanceArgs  = { account : AccountIdText };
    public type Balance               = { e8s     : Nat64     };
    public type SendArgs            = {
        memo            : Nat64;
        amount          : Nat64;
        fee             : { e8s     : Nat64     };
        from_subaccount : ?SubaccountNat8Arr;
        to              : AccountIdText;
        created_at_time : ?Time.Time;
    };

    public type TransferRequest = {
        memo: Nat64;
        info: Text;
        from: ?SubaccountNat8Arr;
        to: AccountIdText;
        amount: Nat64;
    };

};