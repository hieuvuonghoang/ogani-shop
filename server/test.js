const express = require('express')

const mongoose = require('mongoose')
const db = "mongodb://hieuvh:hieu2111@localhost:27017/oganishopdb"

mongoose.connect(db, err => {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected to mongodb')
    }
})

const publisherSchema = new mongoose.Schema({
    companyName: String,
    firstParty: Boolean,
    website: String
});

const Publisher = mongoose.model('Publisher', publisherSchema);

// const Game = mongoose.model('Game', new mongoose.Schema({
//     title: String,
// }));

const gameSchema = new mongoose.Schema({
    title: String,
    publisher: publisherSchema,
});

const Game = mongoose.model('Game', gameSchema);

async function createPublisher(companyName, firstParty, website) {
    const publisher = new Publisher({
        companyName,
        firstParty,
        website
    });
    // console.log(publisher);
    const result = await publisher.save();
    console.log(result);
}

async function createGame(title, publisher) {
    const game = new Game({
        title,
        publisher,
    });

    const result = await game.save();
    console.log(result);
}

async function listGames() {
    const games = await Game
        .find()
        .populate('publisher', 'companyName _id')
        .select('title publisher');

    console.log(games);
}

// createPublisher('Nintendo', true, 'https://www.nitendo.com/');
// createGame('Sper Smash Bros', '6118f6028ae77333e8f42460');

listGames();
// createGame('Rayman', new Publisher({
//     companyName: 'Ubisoft',
//     firstParty: false,
//     website: 'https://www.ubsoft.con/'
// }))


