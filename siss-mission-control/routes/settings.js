const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

let settings = {
    frequency: "8.4 GHz",
    bandwidth: "120 MHz",
    timeout: "5",
    protocol: "S-BAND"
};

// 설정 페이지
router.get("/settings", requireLogin, (req, res) => {
    res.render("settings", {
        settings,
        message: null
    });
});

// 설정 변경
router.post("/settings", requireLogin, (req, res) => {
    settings.frequency = req.body.frequency;
    settings.bandwidth = req.body.bandwidth;
    settings.timeout = req.body.timeout;
    settings.protocol = req.body.protocol;

    res.render("settings", {
        settings,
        message: "Communication settings updated."
    });
});

module.exports = router;