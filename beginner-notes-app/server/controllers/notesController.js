const Notes = require("../models/notes");

//Create a note
const createNote = async (req, res) => {
    const { title, description } = req.body;

    const userId = req.user?.id || req.user?._id;

    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        const cleanTitle = title.trim();
        const cleanDescription = typeof description === 'string' ? description.trim() : description;

        // check existing title for this user only
        const existingTitle = await Notes.findOne({ title: cleanTitle, userId });
        if (existingTitle) {
            return res.status(400).json({ message: 'A note with this title already exists' });
        }

        const newNote = await Notes.create({
            title: cleanTitle,
            description: cleanDescription,
            userId
        });

        res.status(201).json({
            success: true,
            message: 'Note Created Successfully',
            note: newNote
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get all notes
const getAllNotes = async (req, res) => {
   const userId = req.user?.id || req.user?._id;
    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const notes = await Notes.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'All Notes Fetched Successfully',
            notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Get notes by Id
const getSingleNote = async (req, res) => {
    const notesId = req.params.id;
    const userId = req.user?.id || req.user?._id;
    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const note = await Notes.findById(notesId);
        if (!note || note.userId.toString() !== userId.toString()) {
            return res.status(404).json({ message: 'No Permission, Trying to access others notes' });
        }

        res.status(200).json({
            success: true,
            message: 'Note Fetched Successfully',
            note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Update Notes
const updateNote = async (req, res) => {
    const notesId = req.params.id;
    const { title, description } = req.body;
    const userId = req.user?.id || req.user?._id;
    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const note = await Notes.findById(notesId);
        if (!note || note.userId.toString() !== userId.toString()) {
            return res.status(404).json({
                success: false,
                message: 'Note does not exist'
            });
        }

        const updatedNote = await Notes.findByIdAndUpdate(
            notesId,
            { title, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Note Updated successfully',
            newNote: updatedNote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Delete Notes
const deleteNote = async (req, res) => {
    const notesId = req.params.id;
   const userId = req.user?.id || req.user?._id;
    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const note = await Notes.findById(notesId);
        if (!note || note.userId.toString() !== userId.toString()) {
            return res.status(404).json({
                success: false,
                message: 'Note does not exist'
            });
        }

        await Notes.findByIdAndDelete(notesId);
        res.status(200).json({
            success: true,
            message: 'Note Deleted Successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote
};