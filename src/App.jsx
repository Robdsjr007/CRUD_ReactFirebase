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
  const [area, setArea] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const database = getDatabase(firebaseApp);
  const usersRef = ref(database, "users");

  async function criarDado() {
    if (!area || !nascimento || !pronomes || !sexo || !telefone) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      const newUserRef = push(usersRef);
      await set(newUserRef, {
        area,
        nascimento,
        pronomes,
        sexo,
        telefone
      });
      alert("dados salvos com sucesso");
      setArea("");
      setNascimento("");
      setPronomes("");
      setSexo("");
      setTelefone("");
    } catch (e) {
      console.error("Error adding data: ", e);
    }
  }
  
  async function updateUser(id) {
    if (!area || !nascimento || !pronomes || !sexo || !telefone) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      const userRef = ref(database, `users/${id}`);
      await set(userRef, {
        area,
        nascimento,
        pronomes,
        sexo,
        telefone
      });
      alert("dados atualizados com sucesso");
      setSelectedUserId(null);
      setArea("");
      setNascimento("");
      setPronomes("");
      setSexo("");
      setTelefone("");
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
      const confirmDelete = window.confirm("Você tem certeza que deseja excluir este usuário?");
      if (!confirmDelete) {
        return;
      }
    
      const userRef = ref(database, `users/${id}`);
      await remove(userRef);
    }
    
  function editUser(id) {
    const selectedUser = users.find((user) => user.id === id);
    setSelectedUserId(id);
    setArea(selectedUser.area);
    setNascimento(selectedUser.nascimento);
    setPronomes(selectedUser.pronomes);
    setSexo(selectedUser.sexo);
    setTelefone(selectedUser.telefone);
  }

  return (
    <div>
      <input
  type="text"
  placeholder="Área"
  value={area}
  onChange={(e) => setArea(e.target.value)}
/>
<input
  type="text"
  placeholder="Data de Nascimento"
  value={nascimento}
  onChange={(e) => setNascimento(e.target.value)}
/>
<input
  type="text"
  placeholder="Pronomes"
  value={pronomes}
  onChange={(e) => setPronomes(e.target.value)}
/>
<input
  type="text"
  placeholder="Sexo"
  value={sexo}
  onChange={(e) => setSexo(e.target.value)}
/>
<input
  type="text"
  placeholder="Telefone"
  value={telefone}
  onChange={(e) => setTelefone(e.target.value)}
/>
      {selectedUserId ? (
        <button onClick={() => updateUser(selectedUserId)}>Atualizar</button>
      ) : (
        <button onClick={criarDado}>Criar dado</button>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.area} - {user.nascimento} - {user.pronomes} - {user.sexo} - {user.telefone}{" "}
            <button onClick={() => deleteUser(user.id)}>Deletar</button>{" "}
            <button onClick={() => editUser(user.id)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
