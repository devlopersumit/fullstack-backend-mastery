const Notes = require("../models/notes");


//Craete a note
const createNote = async (req, res) => {
    const {title, description} = req.body;
    try {
        const title = await Notes.findOne({title});
        if(title){
         return res.status(400).json({message:'This Notes already exist'});
        }

        const newNote = await Notes.create({
            title, description
        });

        res.statu(201).json({
            success:true,
            message:'Note Created Successfully',
            title:newNote.title,
            description:newNote.description
        });
    } catch (error) {
        res.status(500).json({message:'Notes Creation Failed' || error.message})
    }
};

//Get all notes
const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find();
        if(!notes) {
            return res.status(400).json({message:'not notes are available'});
        }
        res.status(200).json({
            success:true,
            message:'All Notes Fetched Successfully'
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Error Occured in Notes Fetching' || error.message
        })
    }
};

//Get notes by Id
const getSingleNote = async (req, res) => {
    const notesId = req.params.id;
    try {
        const note = await Notes.findById({notesId});
              if(!note) {
            return res.status(400).json({message:'not notes are available'});
        }

        res.status(200).json({
            success:true,
            message:'Notes Fetched Successfully',
            note: note
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Error occured in notes fetching' || error.message
        })
    }
};

//Update Notes
const updateNote = async (req, res) => {
    const notesId = req.params.id;
    const {title, description} = req.body;
    try {
        const note = await Notes.findById({notesId});
        if(!note) {
            return res.status(404).json({
                success:false,
                message:'Notes do not exist'
            });
        }
        const updatedNote = await Notes.findByIdAndUpdate({notesId, title, description});
        res.status(200).json({
            success:true,
            message:'Notes Updated successfully',
            newNote:updatedNote
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Error Occured in Notes Updation' || error.message
        })
    }
};

//Delete Notes
const deleteNote = async (req, res) => {
    const notesId = req.params.id;
    try {
        const note = await Notes.findById({notesId});
        if(!note) {
            return res.status(404).json({
                success:false,
                message:'Notes do not exist'
            });
        }

        await Notes.findByIdAndDelete({notesId});
        res.status(200).json({
            success:true,
            message:'Notes Deleted Sucessfully'
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Occured in Notes Deletion" || error.message
        })
    }
};

module.exports = {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote
};