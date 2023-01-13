export const idlFactory = ({ IDL }) => {
  const AccountIdText__1 = IDL.Text;
  const Currency__1 = IDL.Variant({ 'ICP' : IDL.Null, 'ICET' : IDL.Null });
  const Balance = IDL.Variant({ 'e6s' : IDL.Nat64, 'e8s' : IDL.Nat64 });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const ItemStatus = IDL.Variant({
    'pending' : IDL.Null,
    'list' : IDL.Null,
    'sold' : IDL.Null,
    'unlist' : IDL.Null,
  });
  const Currency = IDL.Variant({ 'ICP' : IDL.Null, 'ICET' : IDL.Null });
  const NewOrder = IDL.Record({
    'memo' : IDL.Text,
    'seller' : IDL.Principal,
    'expiration' : IDL.Int,
    'currency' : Currency,
    'amount' : IDL.Nat64,
  });
  const Status = IDL.Variant({
    'new' : IDL.Null,
    'deposited' : IDL.Null,
    'closed' : IDL.Null,
    'canceled' : IDL.Null,
    'refunded' : IDL.Null,
    'released' : IDL.Null,
    'delivered' : IDL.Null,
    'received' : IDL.Null,
  });
  const Log = IDL.Record({
    'log' : IDL.Text,
    'logger' : IDL.Variant({
      'seller' : IDL.Null,
      'buyer' : IDL.Null,
      'escrow' : IDL.Null,
    }),
    'ltime' : IDL.Int,
  });
  const AccountIdText = IDL.Text;
  const Subaccount = IDL.Nat;
  const EscrowAccount = IDL.Record({
    'id' : AccountIdText,
    'index' : Subaccount,
  });
  const Comment = IDL.Record({
    'ctime' : IDL.Int,
    'user' : IDL.Principal,
    'comment' : IDL.Text,
  });
  const Order = IDL.Record({
    'id' : IDL.Nat,
    'status' : Status,
    'blockout' : IDL.Nat64,
    'updatetime' : IDL.Int,
    'blockin' : IDL.Nat64,
    'logs' : IDL.Vec(Log),
    'memo' : IDL.Text,
    'seller' : IDL.Principal,
    'createtime' : IDL.Int,
    'expiration' : IDL.Int,
    'currency' : Currency,
    'lockedby' : IDL.Principal,
    'account' : EscrowAccount,
    'buyer' : IDL.Principal,
    'comments' : IDL.Vec(Comment),
    'amount' : IDL.Nat64,
  });
  const U_Status = IDL.Variant({
    'list' : IDL.Null,
    'sold' : IDL.Null,
    'locked' : IDL.Principal,
  });
  const U_Itype = IDL.Variant({
    'NFT' : IDL.Null,
    'MERCHANDIS' : IDL.Null,
    'SERVICE' : IDL.Null,
    'OTHER' : IDL.Null,
  });
  const U_Item = IDL.Record({
    'id' : IDL.Nat,
    'status' : U_Status,
    'listime' : IDL.Int,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'currency' : IDL.Variant({ 'ICP' : IDL.Null, 'ICET' : IDL.Null }),
    'image' : IDL.Text,
    'itype' : U_Itype,
    'price' : IDL.Nat64,
  });
  const Itype = IDL.Variant({
    'nft' : IDL.Null,
    'service' : IDL.Null,
    'merchandise' : IDL.Null,
    'other' : IDL.Null,
    'coin' : IDL.Null,
  });
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'status' : ItemStatus,
    'listime' : IDL.Int,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'currency' : IDL.Variant({ 'ICP' : IDL.Null, 'ICET' : IDL.Null }),
    'image' : IDL.Text,
    'itype' : Itype,
    'price' : IDL.Nat64,
  });
  const NewItem = IDL.Record({
    'status' : ItemStatus,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'currency' : IDL.Variant({ 'ICP' : IDL.Null, 'ICET' : IDL.Null }),
    'image' : IDL.Text,
    'itype' : Itype,
    'price' : IDL.Nat64,
  });
  const EscrowService = IDL.Service({
    'accountBalance' : IDL.Func([AccountIdText__1, Currency__1], [Balance], []),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'cancel' : IDL.Func([IDL.Nat], [Result], []),
    'changeItemStatus' : IDL.Func([IDL.Nat, ItemStatus], [Result], []),
    'close' : IDL.Func([IDL.Nat], [Result], []),
    'comment' : IDL.Func([IDL.Nat, IDL.Text], [Result], []),
    'create' : IDL.Func([NewOrder], [Result], []),
    'deleteItem' : IDL.Func([IDL.Nat], [Result], []),
    'deliver' : IDL.Func([IDL.Nat], [Result], []),
    'deposit' : IDL.Func([IDL.Nat], [Result], []),
    'getAccountId' : IDL.Func([IDL.Nat], [IDL.Text], ['query']),
    'getAllOrders' : IDL.Func([IDL.Nat], [IDL.Vec(Order)], []),
    'getBackupItems' : IDL.Func([], [IDL.Vec(U_Item)], ['query']),
    'getBalanceBySub' : IDL.Func([IDL.Nat, Currency__1], [Balance], []),
    'getItem' : IDL.Func([IDL.Nat], [IDL.Opt(Item)], ['query']),
    'getItemsSize' : IDL.Func([], [IDL.Nat], ['query']),
    'getMyAccountId' : IDL.Func([IDL.Nat], [IDL.Text], ['query']),
    'getMyBalanceBySub' : IDL.Func([IDL.Nat, Currency__1], [Balance], []),
    'getMyItems' : IDL.Func([IDL.Nat], [IDL.Vec(Item)], ['query']),
    'getOrder' : IDL.Func([IDL.Nat], [IDL.Opt(Order)], []),
    'getOrders' : IDL.Func([], [IDL.Vec(Order)], []),
    'getSystemData' : IDL.Func(
        [],
        [
          IDL.Record({
            'memory' : IDL.Nat,
            'heap' : IDL.Nat,
            'cycles' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'listItem' : IDL.Func([NewItem], [Result], []),
    'receive' : IDL.Func([IDL.Nat], [Result], []),
    'refund' : IDL.Func([IDL.Nat], [Result], []),
    'release' : IDL.Func([IDL.Nat], [Result], []),
    'searchItems' : IDL.Func([Itype, IDL.Nat], [IDL.Vec(Item)], ['query']),
  });
  return EscrowService;
};
export const init = ({ IDL }) => { return []; };
