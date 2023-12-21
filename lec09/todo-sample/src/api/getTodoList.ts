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
  const url = "http://localhost:8080/todo-list"
  return fetch(url)
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
              error: new Error(String(res.status)),
              kind: ErrorKind.Unknown,
            };
        }
      }

      const body = await res.json();
      return body.map(responseToTodo);
    })
    .catch((e) => {
      const wrappedErr = e
      wrappedErr.message = e.message + `: url : ${url}`

      return {
        error: wrappedErr,
        kind: ErrorKind.Unknown,
      };
    });
};
