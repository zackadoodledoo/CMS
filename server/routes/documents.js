const express = require('express');
const router = express.Router();
const Document = require('../models/document');
const sequenceGenerator = require('./sequenceGenerator');

// GET all documents
router.get('/', (req, res, next) => {
  Document.find()
    .then(documents => {
      res.status(200).json({
        message: 'Documents fetched successfully!',
        documents: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching documents failed.',
        error: error
      });
    });
});

// GET a single document
router.get('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      res.status(200).json({
        message: 'Document fetched successfully!',
        document: document
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching document failed.',
        error: error
      });
    });
});

// POST a new document
router.post('/', (req, res, next) => {
  const maxDocumentId = sequenceGenerator.nextId("documents");

  const document = new Document({
    id: maxDocumentId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully!',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating document failed.',
        error: error
      });
    });
});

// PUT update a document
router.put('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      return document.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Document updated successfully!'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Updating document failed.',
        error: error
      });
    });
});

// DELETE a document
router.delete('/:id', (req, res, next) => {
  Document.deleteOne({ id: req.params.id })
    .then(result => {
      res.status(200).json({
        message: 'Document deleted successfully!'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting document failed.',
        error: error
      });
    });
});

module.exports = router;
