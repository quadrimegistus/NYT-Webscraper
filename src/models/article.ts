module.exports = () => {
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const ArticleSchema = new Schema({
        title: {
            type: String,
            required: true,
            unique: true
        },
        link: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        saved: {
            type: Boolean,
            default: false
        },
        notes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'note'
            }
        ]
    });
    return mongoose.model('article', ArticleSchema);
};
