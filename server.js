const app = require("./app");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();
const port = process.env.PORT;

const corsOptions = {
    origin : "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(cookieSession({
  name: "sukamaju-session",
  secret : process.env.secret,
  httpOnly : true

}));

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
