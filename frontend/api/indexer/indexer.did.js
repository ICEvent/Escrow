export const idlFactory = ({ IDL }) => {
  const Op = IDL.Variant({
    'burn' : IDL.Record({ 'amount' : IDL.Nat64 }),
    'mint' : IDL.Null,
    'transfer' : IDL.Record({ 'to' : IDL.Principal, 'amount' : IDL.Nat64 }),
  });
  return IDL.Service({
    'balance_of' : IDL.Func([IDL.Principal], [IDL.Nat64], ['query']),
    'export' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat64))],
        [],
      ),
    'getlog' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'op' : IDL.Func([Op], [], []),
    'stats' : IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
