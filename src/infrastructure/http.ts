export default interface Http {
  on(method: string, path: string, callback: Function): void;

  listen(port: number, callback?: Function): void;
};
