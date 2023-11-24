const express = require("express");
const port = 3000;
const uuid = require("uuid");

const users = [];

const app = express();
app.use(express.json());

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "user not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", (request, response) => {
  const { name, age } = request.body;

  const user = { id: uuid.v4(), name, age };

  users.push(user);

  return response.status(201).json(user);
});

app.put("/users/:id", checkUserId, (request, response) => {
  const { name, age } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const updatedUser = { id, name, age };

  users[index] = updatedUser;

  return response.json(updatedUser);
});

app.delete("/users/:id", checkUserId, (request, response) => {
  const { index } = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json(users);
});
app.listen(port, () => {
  console.log("🚀 Server started on port 3000");
});
