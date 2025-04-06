const LearningMaterial = require("../Model/learning");
const Classroom = require("../Model/classroom");


async function getResource(req, res) {
    try {
        const studentId = req.user.id;
        const expId = req.params.exp_no; // Fetch experiment number from URL params
console.log('exp no' , expId);
        console.log("Student ID:", studentId);
        console.log("Experiment ID:", expId);

        // Find classes the student is enrolled in
        const enrolledClasses = await Classroom.find({ students: studentId }).select("_id");
        const classIds = enrolledClasses.map((classroom) => classroom._id);

        console.log("Enrolled Class IDs:", classIds);
        const materials = await LearningMaterial.find({
            $and: [
                {
                    $or: [
                        { assignedTo: "all" },  // Assigned to all students
                        { assignedTo: "class", classId: { $in: classIds } }  // Assigned to specific class
                    ]
                },
                { exp_no: expId }  // Correctly filter materials by exp_no
            ]
        });
        
        console.log("Materials Found:", materials);

        // Render the resource page and pass materials to the EJS template
        res.render("resource", { materials });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Server Error");
    }
}



async function ViewResource(req,res){
    try {
        const material = await LearningMaterial.findById(req.params.id);
        if (!material) return res.status(404).send("File not found");

        res.set("Content-Type", material.fileType === "pdf" ? "application/pdf" : material.fileType === "image" ? "image/jpeg" : "video/mp4");
        res.send(material.file);
    } catch (error) {
        console.error("Error viewing file:", error);
        res.status(500).send("Server Error");
    }
}

async function DownloadRes(req,res){
    try {
        const material = await LearningMaterial.findById(req.params.id);
        if (!material) return res.status(404).send("File not found");

        res.set({
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${material.title}.${material.fileType}"`
        });

        res.send(material.file);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).send("Server Error");
    }

}

module.exports={
    getResource,ViewResource,DownloadRes
}