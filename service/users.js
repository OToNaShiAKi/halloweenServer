const Users = require("./../model/Users");

exports.Rank = async (_id) => {
  const users = await Users.find().sort("highest create");
  for (let i = 0; i < users.length; i++) if (_id === users[i]._id) return i + 1;
  return users.length;
};

exports.Find = async (where) => {
  const user = await Users.findOne(
    where,
    "nick password name phone highest uid"
  );
  if (user) user.rank = await this.Rank(user._id);
  return user;
};

exports.Create = async (info) => {
  info.lastest = info.create = new Date();
  const user = await new Users(info).save();
  user.rank = await this.Rank(info._id);
  return user;
};

exports.Update = async (info) => {
  const user = await info.save();
  return user;
};
