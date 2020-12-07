const router = require("koa-router")();
const Users = require("./../controller/users");

router.prefix("/users");

router.post("/account", async (ctx, next) => {
  try {
    const { nick, password } = ctx.request.body;
    const result = await Users.Account(nick, password);
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
});

module.exports = router;
