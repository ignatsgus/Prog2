const express = require("express");
const Sequelize = require("sequelize");
var bodyParser = require("body-parser");
const cors = require("cors");
const dayjs = require("dayjs");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize(
  "Books",
  "avnadmin",
  "AVNS_3xh1818bOQKtxnWfK8h",
  {
    port: 13273,
    host: "mysql-f4197f8-ignatgusev82-d965.c.aivencloud.com",
    dialect:
      "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  }
);

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
    },
    surname: {
      type: Sequelize.DataTypes.STRING,
    },
    role: {
      type: Sequelize.DataTypes.STRING,
    },
  },
  { tableName: "users", timestamps: false }
);

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
    },
    description: {
      type: Sequelize.DataTypes.STRING,
    },
    release_year: {
      type: Sequelize.DataTypes.STRING,
    },
    genre_id: { type: Sequelize.DataTypes.INTEGER },
  },
  { tableName: "books", timestamps: false }
);

const BookGenre = sequelize.define(
  "BookGenre",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    genre_name: { type: Sequelize.DataTypes.STRING },
    description: { type: Sequelize.DataTypes.STRING },
  },
  { tableName: "book_genre", timestamps: false }
);

const BookTaken = sequelize.define(
  "BookTaken",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    book_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    borrow_date: {
      type: Sequelize.DataTypes.DATE,
    },
    return_date: {
      type: Sequelize.DataTypes.DATE,
    },
  },
  { tableName: "borrowed_books", timestamps: false }
);

const BookRequest = sequelize.define(
  "BookRequest",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    book_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    request_date: {
      type: Sequelize.DataTypes.DATE,
    },
    status: {
      type: Sequelize.DataTypes.ENUM("pending", "approved", "rejected"),
    },
  },
  { tableName: "book_requests", timestamps: false }
);

Book.hasMany(BookTaken, { foreignKey: "book_id" });

BookGenre.hasMany(Book, { sourceKey: "id", foreignKey: "genre_id" });
Book.belongsTo(BookGenre, { foreignKey: "genre_id" });

User.belongsToMany(Book, {
  through: BookRequest,
  foreignKey: "user_id",
  otherKey: "book_id",
  as: "requestedBooks",
});

BookRequest.belongsTo(Book, { foreignKey: "book_id" });
BookRequest.belongsTo(User, { foreignKey: "user_id" });

Book.belongsToMany(User, {
  through: BookRequest,
  foreignKey: "book_id",
  otherKey: "user_id",
  as: "requestedByUsers",
});

BookTaken.belongsTo(Book, { foreignKey: "book_id" });
BookTaken.belongsTo(User, { foreignKey: "user_id" });

Book.belongsToMany(User, {
  through: BookTaken,
  foreignKey: "book_id",
  otherKey: "user_id",
});

app.get("/", (req, res) => {
  res.send("Hello World!");

  sequelize.sync();

  sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });
});

app.post("/api/login", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: { email: body.email, password: body.password },
  }).catch(() => undefined);

  if (!user) return res.status(400).json({ error: "User not found" });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
    },
  });
});

app.post("/api/register", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: { email: body.email },
  }).catch(() => undefined);

  if (user) return res.sendStatus(400);

  await User.create({
    name: body.name,
    surname: body.surname,
    password: body.password,
    email: body.email,
    role: "user",
  });

  return res.sendStatus(200);
});

app.post("/api/books", async (req, res) => {
  const books = await Book.findAll({
    limit: 10,
    include: [{ model: BookGenre, attributes: ["genre_name"] }, BookTaken],
  }).catch((error) => {
    return [];
  });

  res.json({
    books: books || [],
  });
});

app.post("/api/user-books", async (req, res) => {
  const takenBooks = await BookTaken.findAll({
    where: { user_id: req.body.userId },
    include: [Book],
  });

  res.json({ books: takenBooks || [] });
});

app.post("/api/books/request", async (req, res) => {
  const body = req.body;

  BookRequest.create({ book_id: body.bookId, user_id: body.userId });
});

app.get("/api/books/request", async (req, res) => {
  const requests = await BookRequest.findAll({
    where: { status: "pending" },
    include: [Book, User],
  });

  res.json({ requests: requests || [] });
});

app.post("/api/books/request-approve", async (req, res) => {
  const body = req.body;

  console.log(body);

  const status = body.isApproved ? "approved" : "rejected";

  await BookRequest.update(
    { status: status },
    { where: { id: body.requestId } }
  );

  if (status === "approved") {
    await BookTaken.create({
      user_id: body.userId,
      book_id: body.bookId,
      borrow_date: dayjs().format(),
    });
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
