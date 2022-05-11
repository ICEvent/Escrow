import Time "mo:base/Time";

module {

    public type AccountId           = Blob;
    public type AccountIdText       = Text;
    public type Subaccount          = Nat;
    public type SubaccountNat8Arr   = [Nat8];
    public type SubaccountBlob      = Blob;


    public type Order ={
        id: Nat;
        from: Principal;
        to: Principal;
        amount: Float;
        currency:{
            #ICP;
            #ICET;
            #ICEG;
            #BTC;
            #ETH;
            #DOT;
            #ADA;
            #USDT;
            #USDC;
        };
        acount: Text;
        blockin: Nat64; 
        blockout: Nat64;
        memo: Text;
        createtime: Int;
        status:{
            #new;
            #deposited;
            #deliveried;
            #released;
            #refunded;
            #closed;
        };
        releasedtime: Int;
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