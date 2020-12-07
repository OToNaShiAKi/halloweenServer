const md5 = require("blueimp-md5");
const Users = require("./../service/users");
const Errors = require("./../model/Error");
const bless = require("./../model/Bless.json");

const Birthday = (user) => {
  const { name, phone } = user;
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  date = `${month}-${day}`;
  const bool =
    md5(name) === "2e585d9de281731883167d027fd624c7" &&
    md5(phone) === "40d0f23ff25e57c1743bdf630a29e23e" &&
    md5(date) === "8365eafb2314684e1a45de4d18aba014";
  return bool;
};

exports.Account = async (nick, password) => {
  password = md5(password);
  let user = await Users.Find(nick);
  if (!user) user = await Users.Create({ nick, password });

  if (user.password !== password) return Errors.User;
  const result = { status: 200, message: "登陆成功", data: user };
  if (Birthday(user)) result.bless = bless;

  return result;
};
