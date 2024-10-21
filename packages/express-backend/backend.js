import express from 'express';
import cors from 'cors';
import userService from './services/user-service.js';
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));
  
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    userService
      .findUserByNameAndJob(name, job)
      .then((result) => {
        userService.findUserByJob(job)
          res.send({ users_list: result });
        })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error finding users by name and job")
      });
  } else if (name !== undefined) {
    userService
      .findUserByName(name)
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error finding users by name")
      });
  } else if (job !== undefined) {
    userService.findUserByJob(job)
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => res.status(500).send("Error finding users by job"));
  } else {
    userService
      .getUsers()
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => res.status(500).send("Error fetching all users"));
  }
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  userService.findUserById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('Resource not found.');
      }
    })
    .catch(error => res.status(500).json(error));
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  userService.addUser(newUser)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(500).json(error));
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  userService.deleteUserById(id)
    .then(result => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).send('Resource not found.');
      }
    })
    .catch(error => res.status(500).json(error));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});