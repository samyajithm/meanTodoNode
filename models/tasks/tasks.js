const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const tasksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    index: { type: Number },
    userId: { type: String },
    description: { type: String },
    important: { type: Boolean, default: false },
    completed: { type : Boolean, default: false },
    createdOn: { type: Date, default: new Date() },
    dueBy: { type: Date, default: null },
    completedOn: { type: Date , default: null}
})

tasksSchema.plugin(AutoIncrement, {inc_field: 'index'});
module.exports = mongoose.model('Tasks', tasksSchema);
