import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UserFormatter from "./UserFormatter/UserFormatter";
import { observer } from "mobx-react-lite";
import { Button, Popover, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { Counter } from "./components/Counter/Counter";
import { Randomizer } from "./components/Randomizer/Randomizer";

const App = () => {
  const [count, setCount] = useState(0);
  const [openedClose, { close, open }] = useDisclosure(false);
  const [opened, { close: close2, open: open2 }] = useDisclosure(false);
  // fetch("https://jsonplaceholder.typicode.com/todos/1222q")
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error(`status: ${res.status}`);
  //     }
  //     return res.json();
  //   })
  //   .then((res) => console.log(res))
  //   .catch((error) => console.error(error));

  // useEffect(() => {
  //   console.log('1')

  //   return () => {
  //     console.log('2')
  //   }
  // }, [count])

  return (
    <>
      <Randomizer />
      <Button
        onClick={() =>
          notifications.show({
            message: "qweqwe",
            title: "qweqweqwe",
          })
        }
      >
        title
      </Button>
      <Popover
        width={200}
        position="bottom"
        withArrow
        shadow="md"
        opened={openedClose}
        styles={{ arrow: { borderColor: "red" } }}
      >
        <Popover.Target>
          <Button onMouseEnter={open} onMouseLeave={close}>
            Hover to see popover
          </Button>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }}>
          <Text size="sm">
            This popover is shown when user hovers the target element
          </Text>
        </Popover.Dropdown>
      </Popover>
      <Popover
        width={200}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <Button onMouseEnter={open2} onMouseLeave={close2}>
            Hover to see popover
          </Button>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }}>
          <Text size="sm">
            This popover is shown when user hovers the target element
          </Text>
        </Popover.Dropdown>
      </Popover>
      <Counter value={count} />
      <button onClick={() => setCount((prev) => prev + 1)}>+++++</button>
    </>
  );
};

export default App;
