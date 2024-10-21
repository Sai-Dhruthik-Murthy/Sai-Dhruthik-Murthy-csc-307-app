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

app.get('/users', (req, res) => {
  const { name, job } = req.query;
  console.log('Fetching users with query:', { name, job });
  userService.getUsers(name, job)
    .then(users => {
      console.log('Users fetched:', users);
      res.status(200).json(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      res.status(500).json(error);
    });
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