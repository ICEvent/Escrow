import Nat "mo:base/Nat";
import Array "mo:base/Array";

module Page{
    public  func getArrayPage<T>(data: [T],page: Nat, pageSize: Nat): [T]{

    if(data.size() == 0 and page < 1) return [];
    var size = pageSize;
    if(data.size() < size) size := data.size();
    
    var index = 0;
    if(page > 1) index := (page - 1)*size;
    if(index > data.size()) return [];
    if(index + size > data.size()) size := data.size() - index;

    Array.tabulate(size, func(i:Nat):T{
        data[index + i]
    })
   
  };
}