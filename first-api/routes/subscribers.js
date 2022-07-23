const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber-model');

//Getting all
router.get('/', async (req, res) => {
    try{
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch(exception) {
        res.status(500).json({ message : exception.message });
    }
});

//creating one
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save();
        res.status(201).send(newSubscriber);
    } catch (exception) {
        res.status(400).json({ message: exception.message });
    }
});

//get one
router.get('/:id', getSubscriber, (req, res) => {
    res.json(req.subscriber);
});

//delete
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await req.subscriber.remove();
        res.json('Subscriber deleted!');
    } catch (exception) {
        res.status(500).json({ message : exception.message });
    }
});

//update
router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null) {
        req.subscriber.name = req.body.name;
    } 
    if(req.body.subscribedToChannel != null) {
        req.subscriber.subscribedToChannel = req.body.subscribedToChannel;
    } 

    try {
        const updatedSubscriber = await req.subscriber.save();
        res.json(updatedSubscriber);
    } catch(exception) {
        res.status(500).json({ message : exception.message });
    }
});

async function getSubscriber(req, res, next) {
    let subscriber;
    try {
        subscriber = await Subscriber.findById(req.params.id);
        if(subscriber == null) {
            return res.status(404).json({ message: 'No subscriber found !!!'});
        }
    } catch(exception) {
        res.status(500).json({ message: exception.message });
    }

    req.subscriber = subscriber;
    next();
}

module.exports = router;