const express=require('express');
const router=express.Router();

router.get('/penExp', (req, res) => {
    res.render("guidedPendulum");
});

router.get('/massExp', (req, res) => {
    res.render("guided-Mass-spring");
});

router.get('/resonance', (req, res) => {
    res.render("guided-resonance");
});


module.exports=router;