
const express=require('express');
const router=express.Router();
const path = require('path');
const {handle_Save_Spring_Exp,handle_pen_exp,handleResonancePost,handleEquilibriumPost
    ,handleForceExperimentPost,handleArchimedesExperimentPost
} = require('../Controller/exp');
const experiments = [
    { id: "penExp", title: "Pendulum", description: "Verification of the laws of simple pendulum", image: "/images/course_1.jpg" },
    { id: "massExp", title: "Mass Spring System", description: "To determine the acceleration due to the gravity by oscillating mass spring system: ", image: "/images/course_2.jpg" },
    { id: "meterExp", title: "Meter Rod Method", description: " Verify the conditions of equilibrium by suspended meter rod method: ", image: "/images/course_3.jpg" },
    { id: "forceExp", title: "Force Table", description: "To find the unknown weight of a body by the method of rectangular component of forces: ", image: "/images/course_4.jpg" },
    { id: "inclineExp", title: "Resonance Exp", description: " Determine the velocity of sound at 0 degree C by resonance Tube  apparatus using first resonance position and applying end correction: "
        , image: "/images/course_5.jpg" }
  ];

router.get('/expriment',(req,res)=>{
    res.render('exp');
})
router.get('/penExp', (req, res) => {
    res.render("pendulumSystem");
});

router.get('/massExp', (req, res) => {
    res.render("MassSpring");
});

router.get('/inclineExp', (req, res) => {
    res.render("Resonance");
});

router.get('/meterExp', (req, res) => {
    res.render("equi");
});

router.get('/forceExp', (req, res) => {
    res.render("grav");
});


router.get('/Arch',(req,res)=>{
    res.render('Archimedes')
})

router.post('/Arch',handleArchimedesExperimentPost);
router.post('/penExp',   handle_pen_exp);

router.post('/massExp',handle_Save_Spring_Exp);

router.post('/inclineExp',handleResonancePost);

router.post('/meterExp', handleEquilibriumPost);

router.post('/forceExp',handleForceExperimentPost);


  module.exports=router;