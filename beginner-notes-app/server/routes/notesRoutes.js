const express = require('express');
const userAuth = require('../Middlewares/auth');
const { createNote, getAllNotes, getSingleNote, updateNote, deleteNote } = require('../controllers/notesController');

const notesRouter = express.Router();

//Create Note
notesRouter.post('/', userAuth, createNote);

//Get all notes
notesRouter.get('/', userAuth, getAllNotes);

//Get single note
notesRouter.get('/:id', userAuth, getSingleNote);

//Update Note
notesRouter.put('/:id', userAuth, updateNote);

//Delete Note
notesRouter.delete('/:id', userAuth, deleteNote);

module.exports = notesRouter;