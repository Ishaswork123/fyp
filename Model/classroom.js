const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
    className: { type: String, required: true },
    classDescription: { type: String, required: true },

    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "tchr", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "std" }]
    ,    classCode: { type: String, unique: true, required: true }

});

module.exports = mongoose.model("Classroom", ClassroomSchema);
