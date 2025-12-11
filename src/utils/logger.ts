export const logger = (requestId: string) => ({
  info: (msg: string, data?: any) =>
    console.log(JSON.stringify({ level: "INFO", requestId, msg, data })),
  error: (msg: string, data?: any) =>
    console.error(JSON.stringify({ level: "ERROR", requestId, msg, data })),
});
