var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var cors = require('cors');
var socketio = require('socket.io');
var app = express();
const PORT = 3000;

// var bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(cors())

var Operations = require("./database/Operations.js")();
var Models = require("./database/Models.js")(mongoose);

var during_game = [];

mongoose.connect('mongodb://localhost/ArrowRacer');
var db;

function connectToMongo() {
    db = mongoose.connection;
    db.on("error", function (err) {
        console.log("Mongo ma problem");
    });
    db.once("open", function () {
        console.log("Mongo jest podłączone i działa!");
        Operations.DeleteAll(Models.Player);
        Operations.DeleteAll(Models.Room);
    });
    db.once("close", function () {
        console.log("Mongo zostało zamknięte.");
    });
}

connectToMongo();

app.get('/newPlayer', function (req, res) {
    
})

let mapPlayerIdToClientId = {

};

const server = app.listen(PORT, function () { 
    console.log(" === Serwer zostaje uruchomiony na porcie " + PORT + ".");
})

var io = socketio(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

io.sockets.on("connection", (client) => {
    console.log("Klient " + client.id + " sie podłączył")

    client.on("newPlayer_req", () => {
        console.log("zrobił to klient " + client.id)

        Operations.SelectNoQuiteFullRooms(Models.Room, (data) => {
            var data = data.data;
    
            if (data.length > 0) {
                var room_id = data[0]._id;
    
                var player = new Models.Player({
                    position: { x: 60, y: 0, z: 0 },
                    color: 'red',
                    ready: false,
                    room_id: room_id,
                })
    
                mapPlayerIdToClientId[player._id] = client.id;
                Operations.InsertOne(player);
                Operations.UpdatePlayerCounter(Models.Room, room_id, data[0].playerCounter+1);
    
                io.sockets.to(client.id).emit("newPlayer_res", player);
            } else {
                var room = new Models.Room({
                    playerCounter: 1,
                    statusOfGame: 0
                });
                Operations.InsertOne(room);
    
                var player = new Models.Player({
                    position: { x: 160, y: 0, z: 0 },
                    color: 'blue',
                    ready: false,
                    room_id: room._id,
                })

                mapPlayerIdToClientId[player._id] = client.id;
                Operations.InsertOne(player);
    
                io.sockets.to(client.id).emit("newPlayer_res", player);
            }
        })
    })

    client.on("playerIsReady_req", (data) => {
        // console.log(data)

        Operations.UpdatePlayerReady(Models.Player, data.playerId, () => {

            Operations.SelectPlayers(Models.Player, data.roomId, (obj) => {
                let records = obj.data;
                let areBothReady = true;
                var enemyId = null;

                // console.log(records)
                records.forEach(player => {
                    if (player.ready == false) {
                        areBothReady = false;
                    }
                    /*
                    console.log("player._id: ")
                    console.log(player._id)
                    console.log("data.playerId: ")
                    console.log(data.playerId) */
                    if (player._id != data.playerId) {
                        enemyId = player._id;
                    }
                });

                if (areBothReady == true && records.length > 1) {
                    console.log("wysyłam do obu graczy")
                    io.sockets.to(client.id).emit("bothPlayersReady_res", { bothReady: true, message: "Zaczynamy grę!"});

                    console.log("enemyId: ")
                    console.log(enemyId)
                    let enemyClientId = mapPlayerIdToClientId[enemyId];

                    io.sockets.to(enemyClientId).emit("bothPlayersReady_res", { bothReady: true, message: "Zaczynamy grę!"});
                } else {
                    // io.sockets.to(client.id).emit("playerIsReady_res", { bothReady: false, message: "Czekaj na drugiego gracza"});
                }
            })
        })
    });

    client.on("updateMyPosition_req", (data) => {

        Operations.UpdatePlayerPosition(Models.Player, data.playerId, data.position, () => {

            Operations.SelectPlayers(Models.Player, data.roomId, (obj) => {

                let records = obj.data;
                let enemyId

                records.forEach(player => {
                    if (player._id != data.playerId) {
                        enemyId = player._id;
                    }
                })

                //send to me
                io.sockets.to(client.id).emit("playersPositions_res", obj);

                //send to enemy
                let enemyClientId = mapPlayerIdToClientId[enemyId];
                io.sockets.to(enemyClientId).emit("playersPositions_res", obj);

            })
        })
    });


    client.emit("test", { test: "testowa wiadomość" })
});

