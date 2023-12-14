import { ErrorWrapper, ErrorKind } from "./errors";

type Request = {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
};

export const postNewTodo = async (
  todo: Request
): Promise<null | ErrorWrapper> => {
  return fetch("http://localhost:8080/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
    mode: "no-cors",
  })
    .then(async (res): Promise<null | ErrorWrapper> => {
      if (res.ok) {
        return null;
      }

      switch (res.status) {
        case 400:
          return {
            error: new Error("Bad Request"),
            kind: ErrorKind.BadRequest,
          };
        case 500:
          return {
            error: new Error("Internal Server Error"),
            kind: ErrorKind.InternalServerError,
          };
        default:
          console.log(res.status)
          return {
            error: new Error("Unknown Error"),
            kind: ErrorKind.Unknown,
          };
      }
    })
    .catch((e) => {
      return {
        error: e,
        kind: ErrorKind.Unknown,
      };
    });
};
