import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: process.env.DATABASE_PASSWORD,
  port: process.env.PORT || 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  items = result.rows
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log(item);
  await db.query("INSERT INTO items (title) VALUES ($1)",[item])
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const getEdit = req.body;
  console.log(getEdit);
  await db.query("UPDATE items SET title = $1 WHERE items.id = $2",[getEdit.updatedItemTitle,getEdit.updatedItemId]);
  res.redirect("/")
});

app.post("/delete", async (req, res) => {
  const getDelete = req.body.deleteItemId;
  console.log(getDelete);
  await db.query("DELETE FROM items WHERE items.id = $1",[getDelete]);
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
