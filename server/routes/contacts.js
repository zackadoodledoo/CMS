const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

// GET all contacts
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching contacts failed.',
        error: error
      });
    });
});

// GET a single contact
router.get('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .populate('group')
    .then(contact => {
      res.status(200).json({
        message: 'Contact fetched successfully!',
        contact: contact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching contact failed.',
        error: error
      });
    });
});

// POST a new contact
router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId("contacts");

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully!',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating contact failed.',
        error: error
      });
    });
});

// PUT update a contact
router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group;

      return contact.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Contact updated successfully!'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Updating contact failed.',
        error: error
      });
    });
});

// DELETE a contact
router.delete('/:id', (req, res, next) => {
  Contact.deleteOne({ id: req.params.id })
    .then(result => {
      res.status(200).json({
        message: 'Contact deleted successfully!'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting contact failed.',
        error: error
      });
    });
});

module.exports = router;
