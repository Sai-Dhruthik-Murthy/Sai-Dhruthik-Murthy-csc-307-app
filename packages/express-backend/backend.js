import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

// Helper functions
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

// Modified addUser function
const addUser = (user) => {
  const newUser = {
    id: generateId(),
    ...user
  };
  users["users_list"].push(newUser);
  return newUser;
};

const deleteUser = (id) => {
  users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
};

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name && job) {
    let result = findUsersByNameAndJob(name, job);
    res.send({ users_list: result });
  } else if (name) {
    let result = findUserByName(name);
    res.send({ users_list: result });
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let user = findUserById(id);
  if (user === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    deleteUser(id);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
