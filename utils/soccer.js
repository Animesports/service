export function getGameStatus({ date, status }) {
  const currentDate = new Date();
  const gameDate = new Date(date);

  const diference = Math.abs(gameDate.getTime() - currentDate.getTime());

  const gameStatus = {
    opened: currentDate < gameDate,
    running: currentDate >= gameDate,
    closed: status === "closed",
    canceled: status === "canceled",
  };

  return Object.keys(gameStatus)
    .filter((key) => gameStatus[key] === true)
    .pop();
}
