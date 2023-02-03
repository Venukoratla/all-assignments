const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const connection = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

connection();
//GET Players API

app.get("/players/", async (request, response) => {
  const playersQuery = `SELECT * FROM cricket_team
    ORDER BY player_id;`;
  const playerDetails = await db.all(playersQuery);
  response.send(playerDetails);
});

// GET Player with ID

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerGet = `SELECT * FROM cricket_team 
    WHERE player_id = ${playerId};`;

  const player = await db.get(playerGet);
  response.send(player);
});

// POST A Player

app.post("/players/", async (request, response) => {
  const playerDetailsIs = request.body;

  const { playerName, jerseyNumber, role } = playerDetailsIs;
  const postingPlayer = `INSERT INTO cricket_team (player_name, jersey_number, role)
    VALUES ('${playerName},
    '${jerseyNumber},
    '${role}');`;

  const newPlayer = await db.run(postingPlayer);
  response.send("Player Added to Team");
});

//UPDATE Player
app.put("players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayer = request.body;
  const { playerName, jerseyNumber, role } = updatePlayer;
  const updateQuery = `UPDATE cricket_team SET player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE player_id = ${playerId};`;

  await db.run(updateQuery);

  response.send("Player Details Updated");
});

// DELETE Player

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;

  await db.run(deletePlayer);
  response.send("Player Removed");
});
