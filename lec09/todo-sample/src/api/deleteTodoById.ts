import { ErrorKind, ErrorWrapper } from "./errors";

export const deleteTodoById = async (
  id: string
): Promise<null | ErrorWrapper> => {
  const url = `http://localhost:8080/todo/${id}`;
  return fetch(url, {
    method: "DELETE",
  })
    .then(async (res) => {
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
              error: new Error(res.statusText),
              kind: ErrorKind.Unknown,
            };
        }
      }

      return null;
    })
    .catch((e: Error) => {
      const wrappedErr = e;
      wrappedErr.message = e.message + `: url : ${url}`;

      return {
        error: wrappedErr,
        kind: ErrorKind.Unknown,
      };
    });
};
