const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const session = require("koa-generic-session");
const redis = require("koa-redis");

const { AllowCrossOrigin, Certification } = require("./model/Intercept");

app.keys = ["hustmaths", "S&T"];

const users = require("./routes/users");

// error handler
onerror(app);

app.use(AllowCrossOrigin);
app.use(session({ store: redis() }));
app.use(Certification);

// middlewares
app.use(bodyparser({ enableTypes: ["json", "form", "text"] }));
app.use(json());
app.use(logger());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
