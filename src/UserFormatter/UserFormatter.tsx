import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import counterStore, { IUser } from "../store/counterStore";

interface UserFormatterProps {}

const UserFormatter: React.FC<UserFormatterProps> = observer(({}) => {
  const { user, setUser, userList, addUser } = counterStore;
  const [newUser, setNewUser] = useState<IUser>({
    name: "",
    age: 0,
    sex: "",
  });
  console.log(userList);

  return (
    <div>
      <p>{user.name}</p>
      <input
        type="text"
        defaultValue={user.name}
        onChange={(e) => setUser({ name: e.target.value })}
      />
      <p>{user.age}</p>
      <button>изменить</button>
      <p>{user.sex}</p>
      <input
        type="text"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />{" "}
      <br />
      <input
        type="number"
        value={newUser.age}
        onChange={(e) =>
          setNewUser({ ...newUser, age: Number(e.target.value) })
        }
      />{" "}
      <br />
      <input
        type="text"
        value={newUser.sex}
        onChange={(e) => setNewUser({ ...newUser, sex: e.target.value })}
      />{" "}
      <br />
      <button
        onClick={() => {
          addUser(newUser);
          setNewUser({
            name: "",
            age: 0,
            sex: "",
          });
        }}
      >
        добавить пользователя
      </button>
      {userList.map((item) => (
        <div>
          <p>{item.name}</p>
          <p>{item.age}</p>
          <p>{item.sex}</p>
        </div>
      ))}
    </div>
  );
});
export default UserFormatter;
