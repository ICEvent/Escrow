// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type AccountIdentifier = Text;
  public type AccountIdentifier__1 = Text;
  public type Balance = Nat;
  public type BalanceRequest = { token : TokenIdentifier; user : User__1 };
  public type BalanceResponse = { #ok : Balance; #err : CommonError };
  public type Balance__1 = Nat;
  public type Balance__2 = Nat;
  public type CommonError = { #InvalidToken : TokenIdentifier; #Other : Text };
  public type CommonError__1 = {
    #InvalidToken : TokenIdentifier;
    #Other : Text;
  };
  public type Date = Nat64;
  public type Extension = Text;
  public type Memo = [Nat8];
  public type Memo__1 = [Nat8];
  public type Metadata = {
    #fungible : {
      decimals : Nat8;
      metadata : ?[Nat8];
      name : Text;
      symbol : Text;
    };
    #nonfungible : { metadata : ?[Nat8] };
  };
  public type Result = { #ok : Transaction; #err : Text };
  public type Result_1 = { #ok : [Transaction]; #err : CommonError };
  public type Result_2 = { #ok : Balance__2; #err : CommonError__1 };
  public type Result_3 = { #ok : Metadata; #err : CommonError__1 };
  public type SubAccount = [Nat8];
  public type TokenIdentifier = Text;
  public type TokenIdentifier__1 = Text;
  public type Transaction = {
    date : Date;
    request : TransferRequest;
    txid : TransactionId;
  };
  public type TransactionId = Nat;
  public type TransactionVerifyRequest = {
    to : User;
    from : User;
    memo : Memo;
    amount : Balance__1;
  };
  public type TransactionsRequest = {
    token : TokenIdentifier;
    query_option : {
      #all;
      #date : (Date, Date);
      #page : (Nat, Nat);
      #txid : TransactionId;
      #user : User__1;
    };
  };
  public type TransferIdResponse = {
    #ok : Nat;
    #err : {
      #CannotNotify : AccountIdentifier;
      #InsufficientBalance;
      #InvalidToken : TokenIdentifier;
      #Rejected;
      #Unauthorized : AccountIdentifier;
      #Other : Text;
    };
  };
  public type TransferRequest = {
    to : User__1;
    token : TokenIdentifier;
    notify : Bool;
    from : User__1;
    memo : Memo__1;
    subaccount : ?SubAccount;
    amount : Balance;
  };
  public type TransferRequest__1 = {
    to : User__1;
    token : TokenIdentifier;
    notify : Bool;
    from : User__1;
    memo : Memo__1;
    subaccount : ?SubAccount;
    amount : Balance;
  };
  public type TransferResponse = {
    #ok : Balance;
    #err : {
      #CannotNotify : AccountIdentifier;
      #InsufficientBalance;
      #InvalidToken : TokenIdentifier;
      #Rejected;
      #Unauthorized : AccountIdentifier;
      #Other : Text;
    };
  };
  public type User = { #principal : Principal; #address : AccountIdentifier };
  public type User__1 = {
    #principal : Principal;
    #address : AccountIdentifier;
  };
  public type Self = actor {
    acceptCycles : shared () -> async ();
    availableCycles : shared query () -> async Nat;
    balance : shared query BalanceRequest -> async BalanceResponse;
    extensions : shared query () -> async [Extension];
    metadata : shared query TokenIdentifier__1 -> async Result_3;
    registry : shared query () -> async [(AccountIdentifier__1, Balance__2)];
    supply : shared query TokenIdentifier__1 -> async Result_2;
    transactions : shared query TransactionsRequest -> async Result_1;
    transfer : shared TransferRequest__1 -> async TransferResponse;
    transferTo : shared TransferRequest__1 -> async TransferIdResponse;
    verifyTransaction : shared query TransactionVerifyRequest -> async Result;
  }
}