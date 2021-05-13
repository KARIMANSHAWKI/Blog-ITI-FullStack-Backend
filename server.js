const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// ***************** Bring Routes *****************
const authRoutes = require("./routes/auth.route");
const userRoute = require("./routes/user.rout");
const categoryRoute = require("./routes/category.rout");
const tagRoure = require("./routes/tag.route");
const blog = require("./routes/blog.route");

// ***************** app ********************
const app = express();

// ***************** middelwares *****************
app.use(
  cors({
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    origin: "*",
  })
);
app.options("*", cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ***************** cors *****************
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// ***************** DB Connection *****************
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"));

// ***************** using routes *****************
app.use("/api", authRoutes);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", tagRoure);
app.use("/api", blog);

// ***************** port *****************
const port = process.env.PORT || 3310;
app.listen(port, () => {
  console.log(`Server Listen On Port ${port} `);
});
