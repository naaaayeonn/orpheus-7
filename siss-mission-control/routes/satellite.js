const express = require("express");

const router = express.Router();

function requireLogin(req, res, next) {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

const satellites = [

    {
        id:1,
        name:"SISS-01",
        orbit:"LEO",
        status:"ONLINE",
        signal:"98%"
    },

    {
        id:2,
        name:"ORION-4",
        orbit:"MEO",
        status:"ONLINE",
        signal:"87%"
    },

    {
        id:3,
        name:"ARES-2",
        orbit:"LEO",
        status:"STANDBY",
        signal:"73%"
    },

    {
        id:4,
        name:"LUNA-3",
        orbit:"LUNAR",
        status:"ONLINE",
        signal:"91%"
    }

];

router.get("/satellites", requireLogin, (req,res)=>{

    res.render("satellites",{
        satellites
    });

});

router.get("/satellite/:id", requireLogin, (req,res)=>{

    const satellite = satellites.find(
        s=>s.id==req.params.id
    );

    if(!satellite){

        return res.send("Satellite not found");

    }

    res.render("satellite-detail",{

        satellite

    });

});

module.exports = router;