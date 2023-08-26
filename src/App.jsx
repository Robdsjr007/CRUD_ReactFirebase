import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set
} from "firebase/database";
import { useEffect, useState } from "react";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCFqBiVE7yS-jWdDB5LNS0-McDwPdO8svg",
  authDomain: "flyvoo.firebaseapp.com",
  databaseURL: "https://flyvoo-default-rtdb.firebaseio.com",
  projectId: "flyvoo",
  storageBucket: "flyvoo.appspot.com",
  messagingSenderId: "876266782253",
  appId: "1:876266782253:web:5c8e8eb45fff737b8482a4",
  measurementId: "G-CX03QR9M45"
});

export const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const database = getDatabase(firebaseApp);
  const usersRef = ref(database, "users");

  async function criarDado() {
    try {
      const newUserRef = push(usersRef);
      await set(newUserRef, {
        name,
        email
      });
      console.log("dados salvos com sucesso");
      setName("");
      setEmail("");
    } catch (e) {
      console.error("Error adding data: ", e);
    }
  }

  async function updateUser(id) {
    try {
      const userRef = ref(database, `users/${id}`);
      await set(userRef, {
        name,
        email
      });
      console.log("dados atualizados com sucesso");
      setSelectedUserId(null);
      setName("");
      setEmail("");
    } catch (e) {
      console.error("Error updating data: ", e);
    }
  }

  useEffect(() => {
    const getUsers = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersArray = Object.keys(usersData).map((userId) => ({
          ...usersData[userId],
          id: userId
        }));
        setUsers(usersArray);
      }
    });

    return () => {
      getUsers(); // Detach the event listener when component unmounts
    };
  }, []);

  async function deleteUser(id) {
    const userRef = ref(database, `users/${id}`);
    await remove(userRef);
  }

  function editUser(id) {
    const selectedUser = users.find((user) => user.id === id);
    setSelectedUserId(id);
    setName(selectedUser.name);
    setEmail(selectedUser.email);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {selectedUserId ? (
        <button onClick={() => updateUser(selectedUserId)}>Atualizar</button>
      ) : (
        <button onClick={criarDado}>Criar dado</button>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}{" "}
            <button onClick={() => deleteUser(user.id)}>Deletar</button>{" "}
            <button onClick={() => editUser(user.id)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
