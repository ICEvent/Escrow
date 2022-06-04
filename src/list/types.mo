import Time "mo:base/Time";

module {

    public type Status = {
            #list;
            #locked: Principal;
            #sold;
        };
    public type Itype = {
            #NFT;
            #SERVICE;
            #MERCHANDIS;
            #OTHER;
        };

    public type Item = {
        name : Text;
        image: Text;
        itype : Itype;
        price : Nat64;
        currency : {
            #ICP;
            #ICET;
        };
        status : Status;
        owner: Principal;
        listime : Int;
    };

    public type NewItem = {
        name : Text;
        image: Text;
        itype : {
            #NFT;
            #SERVICE;
            #MERCHANDIS;
            #OTHER;
        };
        price : Nat64;
        currency : {
            #ICP;
            #ICET;
        };        
    };
    

};