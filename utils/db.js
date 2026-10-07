const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.json');

function initDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({
            autoroles: {},
            bautoroles: {},
            giveaways: []
        }, null, 4));
    }
}

function readDB() {
    initDB();
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading database:', e);
        return { autoroles: {}, bautoroles: {}, giveaways: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 4));
    } catch (e) {
        console.error('Error writing to database:', e);
    }
}

module.exports = {
    get: (key) => {
        const db = readDB();
        return db[key];
    },
    set: (key, value) => {
        const db = readDB();
        db[key] = value;
        writeDB(db);
    },
    updateGiveaways: (giveawaysArray) => {
        const db = readDB();
        db.giveaways = giveawaysArray;
        writeDB(db);
    }
};
