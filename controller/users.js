const md5 = require("blueimp-md5");
const Users = require("./../service/users");
const Errors = require("./../model/Error");
const { bless, present, timer, mail } = require("./../model/Bless.json");

const nodemailer = require("nodemailer");
const fs = require("fs");
const pug = require("pug");

let already = false;

const Time = (hour) => {
  if (0 <= hour && hour < 6) return timer.midnight;
  else if (6 <= hour && hour < 8) return timer.daybreak;
  else if (8 <= hour && hour < 12) return timer.morning;
  else if (12 <= hour && hour < 15) return timer.noon;
  else if (15 <= hour && hour < 18) return timer.afternoon;
  else if (18 <= hour && hour < 24) return timer.evening;
};

const Birthday = (user) => {
  const { name, phone } = user;
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  date = `${month}-${day}`;

  const bool =
    md5(name) === "2e585d9de281731883167d027fd624c7" &&
    md5(phone) === "40d0f23ff25e57c1743bdf630a29e23e" &&
    date === "12-10";
  return bool;
};

exports.Account = async (nick, password) => {
  password = md5(password);
  let user = await Users.Find({ nick });
  if (!user) user = await Users.Create({ nick, password });

  if (user.password !== password) return Errors.User;
  const result = { status: 200, message: "登陆成功", data: user };
  if (Birthday(user)) {
    const time = Time(new Date().getHours());

    result.bless = time.concat(bless);
    result.present = present;
  }

  return result;
};

exports.Info = async (info, user) => {
  const exist = Users.Find(info);
  if (exist) return Errors.Info;

  user = await Users.Update(info, user);
  const result = { status: 200, message: "修改成功", data: user };
  if (Birthday(user)) result.bless = bless;

  return result;
};

exports.Birthday = async (present) => {
  let hour = new Date().getHours();
  if (hour < 12) hour = "morning";
  else if (hour < 14) hour = "noon";
  else if (hour < 16) hour = "afternoon";
  else if (hour < 24) hour = "dusk";

  const html = await pug.renderFile("./index.pug", {
    mail: mail[hour],
    present:
      present.length > 2
        ? "emmmmmm看来我得好好规划规划怎么玩了。"
        : "居然一点都不贪心，惊了惊了！不过我还是会强拉的！",
  });

  await nodemailer
    .createTransport({
      service: "QQ",
      port: 465,
      secure: true,
      auth: { user: "1362446747@qq.com", pass: "hkmxyinhygfpichd" },
    })
    .sendMail({
      from: `"濯墨" <1362446747@qq.com>`,
      to: "1362446747@qq.com",
      subject: "蛋糕来啦！",
      html,
    });

  present = JSON.stringify(present);
  fs.writeFile("./index.json", present, (error) => {
    if (error) console.log(error);
  });

  return { status: 200, message: "邮件发送成功" };
};
