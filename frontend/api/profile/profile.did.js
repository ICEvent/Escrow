export const idlFactory = ({ IDL }) => {
  const Link = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const NewProfile = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Text,
    'pfp' : IDL.Text,
    'name' : IDL.Text,
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
  const UpdateProfile = IDL.Record({
    'bio' : IDL.Text,
    'pfp' : IDL.Text,
    'name' : IDL.Text,
  });
  return IDL.Service({
    'addLink' : IDL.Func([IDL.Text, Link], [Result], []),
    'createProfile' : IDL.Func([NewProfile], [Result], []),
    'deleteLink' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'dumpProfiles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Profile))],
        ['query'],
      ),
    'dumpUserProfiles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))],
        ['query'],
      ),
    'getMyProfile' : IDL.Func([], [IDL.Opt(Profile)], ['query']),
    'getProfile' : IDL.Func([IDL.Text], [IDL.Opt(Profile)], ['query']),
    'listProfiles' : IDL.Func([], [IDL.Vec(Profile)], ['query']),
    'updateProfile' : IDL.Func([IDL.Text, UpdateProfile], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
