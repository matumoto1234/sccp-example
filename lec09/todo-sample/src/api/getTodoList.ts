import { Todo } from "../components/TodoCard";
import { ErrorKind, ErrorWrapper } from "./errors";

type Response = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
};

const responseToTodo = (response: Response): Todo => {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: response.status,
  };
};

export const getTodoList = async (): Promise<Todo[] | ErrorWrapper> => {
  return fetch("http://localhost:8080/todo-list")
    .then(async (res): Promise<Todo[] | ErrorWrapper> => {
      if (!res.ok) {
        switch (res.status) {
          case 404:
            return {
              error: new Error("Not Found"),
              kind: ErrorKind.NotFound,
            };
          case 500:
            return {
              error: new Error("Internal Server Error"),
              kind: ErrorKind.InternalServerError,
            };
          default:
            return {
              error: new Error("Unknown Error"),
              kind: ErrorKind.Unknown,
            };
        }
      }

      const body = await res.json();
      console.log(body)
      return body.map(responseToTodo);
    })
    .catch((e) => {
      return {
        error: e,
        kind: ErrorKind.Unknown,
      };
    });
};
