const express=require('express');
const router=express.Router();

router.get('/penExp', (req, res) => {
    res.render("guidedPendulum");
});

router.get('/massExp', (req, res) => {
    res.render("guided-Mass-spring");
});

router.get('/inclineExp', (req, res) => {
    res.render("guided-resonance");
});

router.get('/meterExp', (req, res) => {
    res.render("guided-meter");
});
router.get('/Arch',(req,res)=>{
    res.render('guidedArch');
})

router.get('/forceExp', (req, res) => {
    res.render("guided-grav");
});
module.exports=router;