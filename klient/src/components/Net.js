const io = require("socket.io-client");

export default class Net {
    constructor () {
        this.client = io("ws://localhost:3000", {
            cors: {
              origin: "http://localhost:8080",
              methods: ["GET", "POST"]
            }
          })

        this.client.on("test", (data) => {
            console.log("WebSocket połączenie...")
        })
    }
    
    searchForRoom (callback) {
        this.client.once("newPlayer_res", (response) => {
            callback(response);
        })

        this.client.emit("newPlayer_req", {})
    }

    playerIsReady (requestData, callback) {
        this.client.once("bothPlayersReady_res", (response) => {
            callback(response);
        })

        this.client.emit("playerIsReady_req", requestData)
    }

    updateMyPosition (requestData, callback) {
        this.client.once("playersPositions_res", (response) => {
            callback(response);
        })

        this.client.emit("updateMyPosition_req", requestData)
    }


}