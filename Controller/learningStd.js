const LearningMaterial = require("../Model/learning");
const Classroom = require("../Model/classroom");


async function getResource(req,res){
    try {
        const studentId = req.user.id; // Get student ID from session/JWT

        // Find classes the student is enrolled in
        const enrolledClasses = await Classroom.find({ students: studentId }).select("_id");

        // Get class IDs as an array
        const classIds = enrolledClasses.map((classroom) => classroom._id);

        // Fetch learning materials assigned to 'all' OR assigned to a class the student is in
        const materials = await LearningMaterial.find({
            $or: [
                { assignedTo: "all" },
                { assignedTo: "class", classId: { $in: classIds } }
            ]
        });

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