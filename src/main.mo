 import Cycles "mo:base/ExperimentalCycles";
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
import TrieMap "mo:base/TrieMap";

import CRC32 "CRC32";
import SHA224 "SHA224";
import Account      "./account";
import Hex          "./hex";
import Types        "./types";
import Utils        "./utils";

actor class EscrowService() = this {



    type Order = Types.Order;
    type Log = Types.Log;
    type Comment = Types.Comment;

    // transfer fee ICP
    let FEE : Nat64 = 10_000;
    let E8S : Nat64 = 10_000_000;

    type AccountId = Types.AccountId; // Blob
    type AccountIdText = Types.AccountIdText;

    type Subaccount = Types.Subaccount; // Nat
    type SubaccountBlob = Types.SubaccountBlob;
    type SubaccountNat8Arr = Types.SubaccountNat8Arr;
    type TransferRequest = Types.TransferRequest;
    type AccountIdentifier = Types.AccountIdentifier;
    type EscrowAccount = Types.EscrowAccount;
    
    // LEDGER


    let Ledger : Types.Ledger = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");

    type AccountIdAndTime = {
        accountId   : AccountIdText;
        time        : Time.Time;
    };

    stable var nextSubAccount : Nat = 1;
    stable var nextOrderId : Nat = 1;
    stable var upgradeOrders: [(Nat,Order)] = [];
    

    var orders = TrieMap.TrieMap<Nat, Order>(Nat.equal, Hash.hash);
        orders := TrieMap.fromEntries<Nat, Order>(Iter.fromArray(upgradeOrders), Nat.equal, Hash.hash);

   
    //buyer create a new order
    public shared({caller}) func create(seller: Principal, amount: Nat64, memo: Text, expiration: Int) : async Result.Result<Nat,Text>{

        if(Principal.isAnonymous(caller)){

            #err("no authenticated");

        }else{
            let orderid = nextOrderId;
            
            orders.put(orderid,
            {
                id = orderid;
                buyer = caller;
                seller = seller;
                memo = memo;
                amount = amount;
                account= getNewAccountId();
                blockin = 0;
                blockout = 0;
                status = #new;
                expiration = expiration;
                createtime = Time.now();
                updatetime = Time.now();
                comments = [];
                logs = [{
                    ltime = Time.now();
                    log = "create order";
                    logger = #buyer;
                }]
            });

            nextOrderId := nextOrderId+1;
            #ok(orderid);
        };
        
    };
    //buyer deposit fund in escrow, and change status to #deposited
    public shared({caller}) func deposit(orderid: Nat): async Result.Result<Nat,Text>{
       
        let order =  Array.find<Order>(Iter.toArray(orders.vals()), func(o: Order):Bool{
               (o.id == orderid) 
            });
        
        switch(order){
            case(?order){
                //check expired time
                if(Int.less(order.expiration * 1_000_000_000,Time.now())){
                    #err("order is expired")
                }else{
                    //check account balance               
                    let balance = await accountBalance(order.account.id);
                    if(Nat64.equal(balance.e8s,0)){
                        #err("no deposit")
                    }else if(Nat64.less(balance.e8s,  order.amount)){
                        #err("deposit (" # Nat64.toText(balance.e8s) # ") is less order ammount" # Nat64.toText(order.amount))
                    }else{
                        let log = {
                            ltime = Time.now();
                            log = "make deposit";
                            logger = #buyer;
                        };
                        var logs : List.List<Log> = List.fromArray(order.logs);
                        logs := List.push(log, logs);

                        orders.put(orderid,
                        {
                                id = orderid;
                                buyer = order.buyer;
                                seller = order.seller;
                                memo = order.memo;
                                amount = order.amount;
                                account= order.account;
                                blockin = order.blockin;
                                blockout = order.blockout;
                                expiration = order.expiration;
                                createtime = order.createtime;

                                status = #deposited;
                                updatetime = Time.now();
                                comments = order.comments;
                                logs = List.toArray(logs);
                            });
                        #ok(1);
                    }  
                }
                 
            };
            case(_){
                #err("no order found")
            };
        };
      
    };

    //seller deliver item to buyer, and change status to #delivered
    public shared({caller}) func deliver(orderid: Nat): async Result.Result<Nat,Text>{
        //update status with delivered
        let order =  Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
               (o.id == orderid) and (o.buyer == caller or o.seller == caller) and (o.status == #new or o.status == #deposited or o.status == #delivered)
            })[0];
        
        //only seller and deposited order can changed to deliver
        if (order.id == orderid and order.status == #deposited and order.seller == caller){

                let log = {
                    ltime = Time.now();
                    log = "deliver order item";
                    logger = #seller;
                };
                var logs : List.List<Log> = List.fromArray(order.logs);
                logs := List.push(log, logs);   

                orders.put(orderid,{
                    id = orderid;
                    buyer = order.buyer;
                    seller = order.seller;
                    memo = order.memo;
                    amount = order.amount;
                    account= order.account;
                    blockin = order.blockin;
                    blockout = order.blockout;
                    expiration = order.expiration;
                    createtime = order.createtime;

                    status = #delivered;
                    updatetime = Time.now();
                    comments = order.comments;
                    logs = order.logs;
                });
            };
            #ok(1);
    };

    //buyer check the item received, call confirm to change status to #released 
     public shared({caller}) func confirm(orderid: Nat): async Result.Result<Nat,Text>{
         //release fund
        let order =  Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
               (o.id == orderid) and (o.buyer == caller or o.seller == caller) and (o.status == #new or o.status == #deposited or o.status == #delivered)
            })[0];
        
        //only buyer and delivered order can release
        if (order.id == orderid and order.status == #delivered and order.buyer == caller){
                let log = {
                    ltime = Time.now();
                    log = "receive the order item";
                    logger = #buyer;
                };
                var logs : List.List<Log> = List.fromArray(order.logs);
                logs := List.push(log, logs);             
            orders.put(orderid,{
                id = orderid;
                buyer = order.buyer;
                seller = order.seller;
                memo = order.memo;
                amount = order.amount;
                account= order.account;
                blockin = order.blockin;
                blockout = order.blockout;
                createtime = order.createtime;
                expiration = order.expiration;

                status = #released;
                updatetime = Time.now();

                comments = order.comments;
                logs = order.logs;                
            });
        };
        #ok(1);
    };
    //seller 
     public shared({caller}) func close(orderid: Nat): async Result.Result<Nat,Text>{
        //update status with closed 
       let order =  Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
               (o.id == orderid) and (o.buyer == caller or o.seller == caller) and (o.status == #new or o.status == #deposited or o.status == #delivered)
            })[0];
        
        //only released orde can close 
        if (order.id == orderid and order.status == #released){
                let log = {
                    ltime = Time.now();
                    log = "close order";
                    logger = #seller;
                };
                var logs : List.List<Log> = List.fromArray(order.logs);
                logs := List.push(log, logs);             
            orders.put(orderid,{
                id = orderid;
                buyer = order.buyer;
                seller = order.seller;
                memo = order.memo;
                amount = order.amount;
                account= order.account;
                blockin = order.blockin;
                blockout = order.blockout;
                createtime = order.createtime;
                expiration = order.expiration;

                status = #closed;
                updatetime = Time.now();

                comments = order.comments;
                logs = order.logs;                
            });
        };
        #ok(1);
    };


    //buyer submit cancel request if status is #deposited
     public shared({caller}) func cancel(orderid: Nat): async Result.Result<Nat,Text>{
        
        let order =  Array.find<Order>(Iter.toArray(orders.vals()), func(o: Order):Bool{
            (o.id == orderid) and (o.buyer == caller or o.seller == caller)
        });
       switch(order){
           case(?order){
               if((order.status == #deposited or order.status == #new) and order.buyer == caller){
                   //refund first
                    let r = await transfer({
                            memo = 1;
                            from = order.account.index;
                            to = Account.getAccountTextId(caller,0);
                            amount = order.amount * E8S - FEE;
                        });
                    switch(r){
                        case(#ok(block)){
                                var logger:{
                                    #buyer;
                                    #seller;
                                    #escrow;
                                } = #escrow;
                                if(order.buyer == caller){
                                    logger:=#buyer;
                                }else if(order.seller == caller){
                                    logger:= #seller;
                                };
                                let log = {
                                    ltime = Time.now();
                                    log = "cancel order";
                                    logger =logger;
                                };
                                var logs : List.List<Log> = List.fromArray(order.logs);
                                logs := List.push(log, logs); 

                            orders.put(orderid,{
                                id = orderid;
                                buyer = order.buyer;
                                seller = order.seller;
                                memo = order.memo;
                                amount = order.amount;
                                account= order.account;
                                blockin = order.blockin;
                                blockout = order.blockout;
                                createtime = order.createtime;
                                expiration = order.expiration;

                                status = #canceled;
                                updatetime = Time.now();

                                comments = order.comments;
                                logs = order.logs;                
                            });
                            #ok(1)
                        };
                        case(#err(e)){
                            #err(e)
                        };
                    }

               }else{
                   #err("no cancel allowed")
               }
           };
           case(_){
               #err("no order found")
           };
       };
       
    };

    //seller refund to buyer anytime
    public shared({caller}) func refund(orderid: Nat): async Result.Result<Nat, Text>{
        let order =  Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
            (o.id == orderid) and (o.buyer == caller or o.seller == caller) and (o.status == #new or o.status == #deposited )
        })[0];
        
        //only released orde can close 
        if (order.id == orderid and order.seller == caller and order.status != #new){
                let log = {
                    ltime = Time.now();
                    log = "refund order";
                    logger = #escrow;
                };
                var logs : List.List<Log> = List.fromArray(order.logs);
                logs := List.push(log, logs); 
            //update order status 
            orders.put(orderid,{
                id = orderid;
                buyer = order.buyer;
                seller = order.seller;
                memo = order.memo;
                amount = order.amount;
                account= order.account;
                blockin = order.blockin;
                blockout = order.blockout;
                createtime = order.createtime;
                expiration = order.expiration;
 
                status = #refunded;
                updatetime = Time.now();

                comments = order.comments;
                logs = order.logs;                
            });
            
            //refund
        };
        #ok(1);
    };

    public shared({caller}) func comment(orderid: Nat, comment: Text): async Result.Result<Nat, Text>{
        let order = Array.find<Order>(Iter.toArray(orders.vals()), func(o: Order):Bool{
            o.id == orderid
        });
        switch(order){
            case(?order){
                if(order.buyer == caller or order.seller == caller){
                    var comments:List.List<Comment> = List.fromArray(order.comments);
                    comments := List.push({
                        ctime = Time.now();
                        comment = comment;
                        user = caller;
                    }, comments);
                    orders.put(orderid,{
                        id = order.id;
                        buyer = order.buyer;
                        seller = order.seller;
                        memo = order.memo;
                        amount = order.amount;
                        account= order.account;
                        blockin = order.blockin;
                        blockout = order.blockout;
                        createtime = order.createtime;
                        expiration = order.expiration;
        
                        status = order.status;
                        updatetime = order.updatetime;

                        comments = List.toArray(comments);
                        logs = order.logs;                
                    });
                    #ok(1)
                }else{
                    #err("no permission")
                }
            };
            case(_){
                #err("no order found")
            }
        };

    };


    public shared({caller}) func checkBalance(account:Text): async Types.ICP{
        await accountBalance(account);
    };
    //fetch user's orders with status: #new; #deposited; #deliveried; 
    public shared({caller}) func getOrders(): async [Order]{
         Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
                Int.greater(o.expiration * 1_000_000_000,Time.now()) and (o.buyer == caller or o.seller == caller) and (o.status == #new or o.status == #deposited or o.status == #delivered)
            })
    };
    
    //fetch user's orde by order id
    public shared({caller}) func getOrder(orderid: Nat): async Order{
         Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
               (o.id == orderid) and (o.buyer == caller or o.seller == caller) and (o.status == #new or o.status == #deposited or o.status == #delivered)
            })[0]
    };

    public shared({caller}) func getAllOrders(): async [Order]{
         Array.filter(Iter.toArray(orders.vals()), func(o: Order):Bool{
                (o.buyer == caller or o.seller == caller) 
            })
    };



    func getNewAccountId () : EscrowAccount {       

        let subaccount = nextSubAccount;
        nextSubAccount += 1;
        let subaccountBlob : SubaccountBlob = Utils.subToSubBlob(subaccount);
        
        let accountIdText = Utils.accountIdToHex(Account.accountIdentifier(getPrincipal(), subaccountBlob));
        return {
            index = subaccount;
            id = accountIdText;
        };
    };


    public shared({caller}) func getMyBalanceBySub(sub: Nat): async Types.ICP{
        let sublob = Utils.subToSubBlob(sub);
         await Ledger.account_balance({ account = Account.accountIdentifier(caller,sublob) });
    };

    public shared func getBalanceBySub(sub: Nat): async Types.ICP{
        let sublob = Utils.subToSubBlob(sub);
         await Ledger.account_balance({ account = Account.accountIdentifier(getPrincipal(),sublob) });
    };

    // LEDGER WRAPPERS
    public shared func accountBalance (account: AccountIdText) : async Types.ICP {
        
        await Ledger.account_balance({ account = Utils.hexToAccountId(account) });
    };


    func transfer (r: TransferRequest) : async Result.Result<Nat64, Text> {
       let res = await Ledger.transfer({
          memo = r.memo;
          from_subaccount = ?Utils.subToSubBlob(r.from);
          to = Blob.fromArray(Hex.decode(r.to));
          amount = { e8s = r.amount};
          fee = { e8s = 10_000 };
          created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        });
        switch (res) {
          case (#Ok(blockIndex)) {
            #ok(blockIndex)
          };
          case (#Err(#InsufficientFunds { balance })) {
            throw Error.reject("Top me up! The balance is only " # debug_show balance # " e8s");
          };
          case (#Err(other)) {
            throw Error.reject("Unexpected error: " # debug_show other);
          };
        };
    };

    
 
    func getPrincipal () : Principal {
        return Principal.fromActor(this);
    };

    func accIdTextKey(s : AccountIdText) : Trie.Key<AccountIdText> {
        { key = s; hash = Text.hash(s) };
    };

    system func preupgrade() {
        upgradeOrders := Iter.toArray(orders.entries());  
    };

    system func postupgrade() {

    };

    public query func availableCycles() : async Nat {
        return Cycles.balance();
    };    
};