exports.cookieConfig = { sameSite: "lax" };
exports.cookieConfigServer = { httpOnly: true, sameSite: "lax" };
exports.apiUrl = {
  development: "https://coex-api.herokuapp.com/",
  sandbox: "https://coex-api.herokuapp.com/",
  staging: "https://coex-api.herokuapp.com/",
  production: "https://coexapi.herokuapp.com/",
};
