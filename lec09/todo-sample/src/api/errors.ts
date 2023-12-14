// 実質的なenum
export const ErrorKind = {
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
  Unknown: 0,
} as const;

export type ErrorKind = (typeof ErrorKind)[keyof typeof ErrorKind];

const isErrorKind = (arg: any): arg is ErrorKind => {
  return Object.values(ErrorKind).includes(arg);
};

export interface ErrorWrapper {
  error: Error;
  kind: ErrorKind;
}

export const isErrorWrapper = (arg: any): arg is ErrorWrapper => {
  return (
    arg !== null &&
    arg !== undefined &&
    typeof arg === "object" &&
    arg.error instanceof Error &&
    isErrorKind(arg.kind)
  );
};
