import express from "express";
import UserController from "./UserController";

const app = express();

app.post("/users/create", UserController.create);
app.get("/users/findAll", UserController.findAll);
app.get("/users/findById/:id", UserController.findById);
app.get("/users/findByQuery", UserController.findByQuery);

app.listen(3333, () => console.log("Executando node server na porta 3333"));
