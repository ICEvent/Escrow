export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Favorite = IDL.Record({
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'address' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Favorite, 'err' : IDL.Text });
  const Link = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const Network = IDL.Variant({
    'ic' : IDL.Null,
    'ethereum' : IDL.Null,
    'bitcoin' : IDL.Null,
  });
  const Wallet = IDL.Record({
    'name' : IDL.Text,
    'addresses' : IDL.Vec(
      IDL.Record({ 'network' : Network, 'address' : IDL.Text })
    ),
  });
  const NewProfile = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Text,
    'pfp' : IDL.Text,
    'name' : IDL.Text,
  });
  const Canister = IDL.Record({
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'posts' : IDL.Text,
    'canisterid' : IDL.Principal,
    'gallery' : IDL.Text,
  });
  const Profile = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Text,
    'pfp' : IDL.Text,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'createtime' : IDL.Int,
    'links' : IDL.Vec(Link),
  });
  const Inbox = IDL.Record({ 'owner' : IDL.Principal, 'inboxid' : IDL.Text });
  const UpdateProfile = IDL.Record({
    'bio' : IDL.Text,
    'pfp' : IDL.Text,
    'name' : IDL.Text,
  });
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [Result], []),
    'addFavorite' : IDL.Func(
        [IDL.Record({ 'name' : IDL.Text, 'address' : IDL.Text })],
        [Result_1],
        [],
      ),
    'addFeaturedProfile' : IDL.Func([IDL.Text], [Result], []),
    'addInbox' : IDL.Func([IDL.Text], [Result], []),
    'addLink' : IDL.Func([IDL.Text, Link], [Result], []),
    'addWallet' : IDL.Func([IDL.Text, Wallet], [Result], []),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'changeId' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'createProfile' : IDL.Func([NewProfile], [Result], []),
    'deleteLink' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'editCanister' : IDL.Func([Canister], [Result], []),
    'getDefaultProfiles' : IDL.Func([IDL.Nat], [IDL.Vec(Profile)], ['query']),
    'getInbox' : IDL.Func([IDL.Text], [IDL.Opt(Inbox)], ['query']),
    'getMyCanister' : IDL.Func([], [IDL.Opt(Canister)], ['query']),
    'getMyFavorites' : IDL.Func([], [IDL.Vec(Favorite)], ['query']),
    'getMyInbox' : IDL.Func([], [IDL.Opt(Inbox)], ['query']),
    'getMyProfile' : IDL.Func([], [IDL.Opt(Profile)], ['query']),
    'getProfile' : IDL.Func([IDL.Text], [IDL.Opt(Profile)], ['query']),
    'getProfileByPrincipal' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(Profile)],
        ['query'],
      ),
    'getProfileCanister' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(Canister)],
        ['query'],
      ),
    'getProfileCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getProfiles' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(Profile)], ['query']),
    'removeFeaturedProfile' : IDL.Func([IDL.Text], [Result], []),
    'reserveid' : IDL.Func([IDL.Text], [Result], []),
    'searchProfilesByName' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Profile)],
        ['query'],
      ),
    'updateProfile' : IDL.Func([IDL.Text, UpdateProfile], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
