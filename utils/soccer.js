export function getGameStatus({ date, status }) {
  const currentDate = new Date();
  const gameDate = new Date(date);

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

export function getSeasonWinners({ clients, games, season }) {
  if (!clients || !games || !season) return;

  games = games
    .filter((g) => {
      return g.status === "closed";
    })
    .filter((g) => {
      return g.reference === season;
    });

  clients = clients.map((user) => {
    const entriesLength = games.filter(
      ({ entries }) => entries.map((e) => e.id).indexOf(user.id) !== -1
    ).length;

    const points = games.map(({ entries, score }) => {
      const entry = entries[entries.map((e) => e.id).indexOf(user.id) ?? -1];
      return computePoints(entry, score);
    });

    return {
      ...user,
      entries: entriesLength,
      points: points.length !== 0 ? points.reduce((a, b) => a + b) : 0,
    };
  });

  return clients.sort((c1, c2) => {
    if (c1.points === c2.points) {
      return c1.entries > c2.entries;
    }
    return c1.points > c2.points;
  });
}

function computePoints(entry, score) {
  if (!entry) return 0;
  if (![entry.visited, entry.visitor].every((e) => !Number.isNaN(e))) return 0;

  const clientWinner = getWinner(entry);
  const currentWinner = getWinner(score);

  if (score.visited === entry.visited && score.visitor === entry.visitor) {
    return 2; // two Points
  }

  return clientWinner === currentWinner ? 1 : 0; // one point
}

function getWinner({ visited, visitor }) {
  return Object.entries({
    visited: () => visited > visitor,
    visitor: () => visitor > visited,
    draw: () => visited === visitor,
  }).filter(([_winner, is]) => is())?.[0][0];
}
