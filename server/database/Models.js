module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var playerSchema = new Schema(
    {
        position: { type: Object, required: true },
        color: { type: String, required: true },
        ready: { type: Boolean, required: true },
        room_id: { type: String, required: true }
    });

    var roomSchema = new Schema({
        playerCounter: { type: Number, required: true },
        statusOfGame: { type: Number, required: true }, // 0 - zbiera graczy, 1 - trwa, 2 - zakończona
    })

    var models = {
        Player: mongoose.model("Player", playerSchema),
        Room: mongoose.model("Room", roomSchema)
    }

    return models;
}