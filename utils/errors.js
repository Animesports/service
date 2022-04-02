import errors from "../errors.json" assert { type: "json" };

export default function responseError(res, statusCode, message) {
  if (res === null)
    return {
      statusCode,
      message: errors[statusCode] ?? "Unknown Error",
    };

  const resMessage = message ?? errors[statusCode] ?? "Unknown Error";
  res.statusMessage = resMessage;

  return res.status(statusCode).json({
    statusCode,
    message: resMessage,
  });
}
