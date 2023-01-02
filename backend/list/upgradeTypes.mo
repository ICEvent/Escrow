import Time "mo:base/Time";
import Types "./types";

module {
        public type U_Status = {
            #list;
            #locked: Principal;
            #sold;
        };
    public type U_Itype = {
            #NFT;
            #SERVICE;
            #MERCHANDIS;
            #OTHER;
        };

    public type U_Item = {
        id: Nat;
        name : Text;
        image: Text;
        itype : U_Itype;
        price : Nat64;
        currency : {
            #ICP;
            #ICET;
        };
        status : U_Status;
        owner: Principal;
        listime : Int;
    };

}
