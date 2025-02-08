
const express=require('express');
const router=express.Router();
const path = require('path');
const {handle_Save_Spring_Exp,handle_pen_exp} = require('../Controller/exp');


router.get('/expriment',(req,res)=>{
    res.render('exp');
})
router.get('/penExp', (req, res) => {
    res.render("pendulumSystem");
});

router.get('/massExp', (req, res) => {
    res.render("MassSpring");
});

router.get('/resonance', (req, res) => {
    res.render("Resonance");
});

router.get('/forceExp', (req, res) => {
    res.render("forceTable");
});

router.get('/inclineExp', (req, res) => {
    res.render("inclinedPlane");
});
router.post('/penExp',  handle_Save_Spring_Exp);

router.post('/massExp',handle_pen_exp);
  module.exports=router;