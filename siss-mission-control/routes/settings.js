const express = require("express");
const router = express.Router();

const {
    syncConfiguration
} = require("../utils/merge");

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

const communicationConfig = {
    frequency: "8.4 GHz",
    bandwidth: "120 MHz",
    timeout: "5",
    protocol: "S-BAND"
};

router.get("/settings", requireLogin, (req, res) => {
    res.render("settings", {
        settings: communicationConfig,
        message: null
    });
});

router.post("/settings", requireLogin, (req, res) => {

    syncConfiguration(
        communicationConfig,
        req.body
    );

    res.render("settings", {
        settings: communicationConfig,
        message: "Communication settings updated."
    });
});

module.exports = router;