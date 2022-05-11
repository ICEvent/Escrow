import Array        "mo:base/Array";
import Blob         "mo:base/Blob";
import Bool         "mo:base/Bool";
import Buffer       "mo:base/Buffer";
import Debug        "mo:base/Debug";
import Error        "mo:base/Error";
import Float        "mo:base/Float";
import Hash         "mo:base/Hash";
import HashMap      "mo:base/HashMap";
import Int          "mo:base/Int";
import Int64        "mo:base/Int64";
import Iter         "mo:base/Iter";
import List         "mo:base/List";
import Nat          "mo:base/Nat";
import Nat64        "mo:base/Nat64";
import Principal    "mo:base/Principal";
import Result       "mo:base/Result";
import Text         "mo:base/Text";
import Time         "mo:base/Time";
import Trie         "mo:base/Trie";

import Account      "./account";
import Hex          "./hex";
import Types        "./types";
import Utils        "./utils";

actor class EscrowService() = this {

    stable var nextSubAccount : Nat = 1;
    stable var nextOrderId : Nat = 1;

    // transfer fee ICP
    let FEE : Nat64 = 10_000;

    type AccountId = Types.AccountId; // Blob
    type AccountIdText = Types.AccountIdText;

    type Subaccount = Types.Subaccount; // Nat
    type SubaccountBlob = Types.SubaccountBlob;
    type SubaccountNat8Arr = Types.SubaccountNat8Arr;

    
    // LEDGER
    type AccountBalanceArgs = Types.AccountBalanceArgs;
    type TransferRequest = Types.TransferRequest;
    type Balance = Types.Balance;
    type SendArgs = Types.SendArgs;
    let Ledger = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor { 
        send_dfx : shared SendArgs -> async Nat64;
        account_balance_dfx : shared query AccountBalanceArgs -> async Balance; 
    };


    type AccountIdAndTime = {
        accountId   : AccountIdText;
        time        : Time.Time;
    };


    private var orders = Buffer.Buffer<Types.Order>(0);
    private stable var state_orders: [Types.Order] = orders.toArray();
    

    //buyer
    public shared({caller}) func create(to: Principal, amount: Float, memo: Text, expiration: Int) : async Result.Result<Nat,Text>{

        if(Principal.isAnonymous(caller)){

            #err("no authenticated");

        }else{
            let orderid = nextOrderId;
            nextOrderId := nextOrderId+1;
            orders.add({
                id = orderid;
                from = caller;
                to = to;
                amount = amount;
                acount: "";
                blockin = 0;
                blockout = 0;
                currency = #ICP;
                createtime = Time.now();
                memo = memo;
                releasedtime = 0;
                status = #new;
                expiration = expiration;
            });

            #ok(orderid);
        };
        
    };
    //buyer
    public shared({caller}) func deposit(orderid: Nat): async Result.Result<Nat,Text>{
        //transfer to escrow
        #ok(1);
    };

    //seller
    public shared({caller}) func deliver(orderid: Nat): async Result.Result<Nat,Text>{
        //update status with delivered
        #ok(1);
    };

    //buyer
     public shared({caller}) func confirm(orderid: Nat): async Result.Result<Nat,Text>{
         //release fund
        #ok(1);
    };

    //buyer
     public shared({caller}) func cancel(orderid: Nat): async Result.Result<Nat,Text>{
         //refund
        #ok(1);
    };
    //seller
     public shared({caller}) func close(orderid: Nat): async Result.Result<Nat,Text>{
        //update status with closed 
        #ok(1);
    };


    func getNewAccountId () : AccountIdText {       

        let subaccount = nextSubAccount;
        nextSubAccount += 1;
        let subaccountBlob : SubaccountBlob = Utils.subToSubBlob(subaccount);
        
        let accountIdText = Utils.accountIdToHex(Account.getAccountId(getPrincipal(), subaccountBlob));
        return accountIdText;
    };




    // LEDGER WRAPPERS

    func accountBalance (account: AccountIdText) : async Balance {
        await Ledger.account_balance_dfx({ account = account });
    };

   

    func transfer (r: TransferRequest) : async Result.Result<Nat64, Text> {
        try {
            let blockHeight = await Ledger.send_dfx({
                memo = r.memo;
                from_subaccount = r.from;
                to = r.to;
                amount = r.amount;
                fee = { e8s = FEE };
                created_at_time = ?Time.now();
            });
            
            return #ok(blockHeight);
        } catch (e) {
           
            return #err("failed to transfer");
        };
    };

    


 
    func getPrincipal () : Principal {
        return Principal.fromActor(this);
    };

    func accIdTextKey(s : AccountIdText) : Trie.Key<AccountIdText> {
        { key = s; hash = Text.hash(s) };
    };

};