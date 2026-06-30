const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const sequenceGenerator = require('./sequenceGenerator');

// GET all messages
router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching messages failed.',
        error: error
      });
    });
});

// GET a single message
router.get('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .populate('sender')
    .then(message => {
      res.status(200).json({
        message: 'Message fetched successfully!',
        messageData: message
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching message failed.',
        error: error
      });
    });
});

// POST a new message
router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully!',
        messageData: createdMessage
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating message failed.',
        error: error
      });
    });
});

// PUT update a message
router.put('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      return message.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Message updated successfully!'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Updating message failed.',
        error: error
      });
    });
});

// DELETE a message
router.delete('/:id', (req, res, next) => {
  Message.deleteOne({ id: req.params.id })
    .then(result => {
      res.status(200).json({
        message: 'Message deleted successfully!'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting message failed.',
        error: error
      });
    });
});

module.exports = router;
