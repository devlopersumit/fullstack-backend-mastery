import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Hero = () => {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    // New state for viewing a note in full
    const [viewModal, setViewModal] = useState(false)
    const [viewNote, setViewNote] = useState(null)

    const fetchNotes = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/notes`,
                { withCredentials: true }
            )
            setNotes(response.data.notes || [])
            setError('')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error fetching notes')
            console.error('Fetch notes error:', err)
            setNotes([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [])

    const openModal = () => {
        setCreateError('')
        setTitle('')
        setDescription('')
        setIsEditing(false)
        setEditingId(null)
        setShowModal(true)
    }
    const closeModal = () => {
        setShowModal(false)
        setCreateError('')
    }

    const handleCreateOrUpdateNote = async () => {
        setCreateError('')
        const t = title?.trim()
        const d = typeof description === 'string' ? description.trim() : ''
        if (!t) {
            setCreateError('Title is required')
            return
        }
        if (t.length > 100) {
            setCreateError('Title must be 100 characters or less')
            return
        }
        if (d.length > 500) {
            setCreateError('Description must be 500 characters or less')
            return
        }

        try {
            setCreating(true)
            if (isEditing && editingId) {
                await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/notes/${editingId}`,
                    { title: t, description: d },
                    { withCredentials: true }
                )
            } else {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/notes`,
                    { title: t, description: d },
                    { withCredentials: true }
                )
            }
            await fetchNotes()
            setShowModal(false)
            setIsEditing(false)
            setEditingId(null)
        } catch (err) {
            setCreateError(err.response?.data?.message || err.message || 'Failed to save note')
            console.error('Save note error:', err)
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (id) => {
        const ok = window.confirm('Delete this note?')
        if (!ok) return
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/notes/${id}`,
                { withCredentials: true }
            )
            await fetchNotes()
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete note')
            console.error('Delete note error:', err)
        }
    }

    const handleEdit = (note) => {
        setTitle(note.title || '')
        setDescription(note.description || '')
        setIsEditing(true)
        setEditingId(note._id)
        setCreateError('')
        setShowModal(true)
    }

    // New: open view modal with full note
    const handleView = (note) => {
        setViewNote(note)
        setViewModal(true)
    }
    const closeView = () => {
        setViewNote(null)
        setViewModal(false)
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
                <button
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition cursor-pointer"
                    onClick={openModal}
                >
                    <span className="mr-2">+</span>
                    Add New Note
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading notes...</div>
                </div>
            )}

            {/* Notes Grid */}
            {!loading && notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                {note.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {note.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleView(note)}
                                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 transition cursor-pointer"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
                    </div>
                )
            )}

            {/* Create / Edit Note Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal() }}
                >
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Note' : 'Create Note'}</h3>

                        {createError && (
                            <div className="mb-3 text-sm text-red-600">
                                {createError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Note title (required)"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Optional description"
                                    rows={4}
                                    maxLength={500}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateOrUpdateNote}
                                    disabled={creating}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md disabled:opacity-60 cursor-pointer"
                                >
                                    {creating ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save' : 'Create')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Note Modal (read-only) */}
            {viewModal && viewNote && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onMouseDown={(e) => { if (e.target === e.currentTarget) closeView() }}
                >
                    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-2xl font-semibold text-gray-800">{viewNote.title}</h3>
                            <button
                                onClick={closeView}
                                aria-label="Close"
                                className="text-gray-500 hover:text-gray-700 ml-4 active:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="prose max-w-full text-gray-700 mb-6 whitespace-pre-wrap">
                            {viewNote.description || 'No description provided.'}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closeView}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Hero
