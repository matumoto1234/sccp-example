import { useEffect, useState } from "react";
import { TodoCardList, Todo } from "./components/TodoCard";
import { getTodoList } from "./api/getTodoList";
import { ErrorKind, ErrorWrapper, isErrorWrapper } from "./api/errors";
import { postNewTodo } from "./api/postNewTodo";

const toStatus = (status: string): "pending" | "in-progress" | "done" => {
  switch (status) {
    case "pending":
      return "pending";
    case "in-progress":
      return "in-progress";
    case "done":
      return "done";
    default:
      return "pending";
  }
};

const useApp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    getTodoList().then((res: ErrorWrapper | Todo[]) => {
      if (isErrorWrapper(res)) {
        switch (res.kind) {
          case ErrorKind.NotFound:
            setErrorMessage("Not Found");
            break;
          case ErrorKind.InternalServerError:
            setErrorMessage("Internal Server Error");
            break;
          default:
            setErrorMessage("Unknown Error");
        }
      } else {
        setTodoList(res);
        console.log(res);
      }
    });
  }, []);

  const createTodo = (title: string, description: string, status: string) => {
    postNewTodo({
      title,
      description,
      status: toStatus(status),
    }).then((res: null | ErrorWrapper) => {
      if (isErrorWrapper(res)) {
        switch (res.kind) {
          case ErrorKind.NotFound:
            setErrorMessage("Not Found");
            break;
          case ErrorKind.InternalServerError:
            setErrorMessage("Internal Server Error");
            break;
          default:
            setErrorMessage("Unknown Error");
        }
      }
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const status = form.get("status") || "";
    createTodo(title.toString(), description.toString(), status.toString());
  };

  return {
    errorMessage,
    todoList,
    handleSubmit,
  };
};

import { FormEventHandler } from "react";

const App: React.FC = () => {
  const { errorMessage, todoList, handleSubmit } = useApp();

  if (errorMessage !== "") {
    return <p>{errorMessage}</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" defaultValue="" />
        </label>
        <label>
          Description:
          <input type="text" name="description" defaultValue="" />
        </label>
        <label>
          Status:
          <input type="text" name="status" defaultValue="" />
        </label>
        <input type="submit" value="Create TODO" />
      </form>
      <TodoCardList todoCardList={todoList} />
    </>
  );
};

export default App;
