let redis = require("redis");

client = redis.createClient(6379, "52.83.91.168");

client.on("error", function (err) {
    console.log("Error " + err);
});

let setKey = (key, value) => {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, replay) => {
            if (err) {
                reject(err);
            } else {
                resolve(replay);
            }
        })
    })
};

let getKey = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, replay) => {
            if (err) {
                reject(err);
            } else {
                resolve(replay);
            }
        })
    })
};

let clearKey = (key) => {
    return new Promise((resolve, reject) => {
        client.del(key, (err, replay) => {
            if (err) {
                reject(err);
            } else {
                resolve(replay);
            }
        })
    })
};

module.exports = {
    setKey, getKey, clearKey
};
