module.exports = () => {
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const NoteSchema = new Schema({
        body: String
    });
    return mongoose.model('note', NoteSchema);
};
