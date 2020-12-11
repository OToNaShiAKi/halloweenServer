const router = require("koa-router")();
const Users = require("./../controller/users");

router.prefix("/users");

router.post("/account", async (ctx, next) => {
  try {
    const { nick, password } = ctx.request.body;
    const result = await Users.Account(nick, password);
    if (result.status === 200) ctx.session.user = result.data;
    ctx.body = result;
  } catch (error) {
    ctx.body = Error(error.message || error);
  }
});

router.post("/info", async (ctx, next) => {
  try {
    const info = ctx.request.body;
    const user = ctx.session.user;
    const result = await Users.Info(info, user);
    ctx.body = result;
  } catch (error) {
    ctx.body = Error(error.message || error);
  }
});

router.post("/birthday", async (ctx, next) => {
  try {
    const { present } = ctx.request.body;
    const result = await Users.Birthday(present);
    ctx.body = result;
  } catch (error) {
    ctx.body = Error(error.message || error);
  }
});

module.exports = router;
