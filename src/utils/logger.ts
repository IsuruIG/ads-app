export const logger = {
  info: (msg: any) => console.log(JSON.stringify({ level: "info", ...msg })),
  error: (msg: any) =>
    console.error(JSON.stringify({ level: "error", ...msg })),
};
