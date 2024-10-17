import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const character = characters[index];

    deleteUser(character.id)
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else if (response.status === 404) {
          console.log("User not found in the backend");
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
  }

  function postUser(person) {
    return fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("Failed to add user");
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
