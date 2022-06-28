module.exports = function () {
    var opers = {
        InsertOne: function (data) {
            data.save(function (error, data, dodanych) {
                console.log("dodano " + data)
            })
        },

        SelectAll: function (Model, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            })
        },

        SelectAndLimit: function (Model, count, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(count)
        },

        SelectPlayers: function (Model, room_id, callback) {
            var obj = {};
            Model.find({ room_id: room_id }, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(2)
        },

        SelectOneRoom: function (Model, id_room, callback) {
            var obj = {};
            Model.find({ _id: id_room }, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(1)
        },

        SelectNoQuiteFullRooms : function (Model, callback) {
            var obj = {};
            Model.find({ playerCounter: { $lt: 2 } }, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(1)
        },

        DeleteAll: function (Model) {
            Model.remove(function (err, data) {
                if (err) return console.error(err);
            })
        },

        DeleteById: function (Model, _id) {
            Model.remove({ _id: _id }, function (err, data) {
                if (err) return console.error(err);
                console.log(data);
            })
        },

        DeleteFirst: function (Model) {
            Model.deleteOne({}, function (err, data) {
                if (err) return console.error(err);
            })
        },

        DeletePlayersByIdGame: function (Model, id_game) {
            Model.remove({ id_game: id_game }, function (err, data) {
                if (err) return console.error(err);
                console.log(data);
            })
        },

        UpdatePlayerCounter: function (Model, _id, playerCounter) {
            Model.update({ _id: _id }, { playerCounter: playerCounter }, function (err) {
                if (err) return console.error(err);
            })
        },

        UpdatePlayerReady: function (Model, _id, callback) {
            Model.update({ _id: _id }, { ready: true }, function (err) {
                if (err) return console.error(err);
                else callback();
            })
        },

        UpdatePlayerPosition: function (Model, _id, position, callback) {
            Model.update({ _id: _id }, { position: position }, function (err) {
                if (err) return console.error(err);
                else callback();
            })
        },
    }

    return opers;

}