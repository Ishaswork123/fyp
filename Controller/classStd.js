const Teacher=require('../Model/tchr')
const Classroom = require("../Model/classroom");

async function showClass(req,res){
    try {
        const studentId = req.user.id; // Extract student ID from the JWT token

        // Find classes where the   try {

        // Find classes where the student is enrolled & populate teacher data
        const classes = await Classroom.find({ students: studentId })
            .populate({
                path: "teacher",
                select: "fname", // Fetch only 'fname' from Teacher model
                model: Teacher
            });

        res.render("stdRoom", { classes });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

module.exports={
    showClass
}