const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

router.get("/telemetry", requireLogin, (req, res) => {
    res.render("telemetry", {
        result: null
    });
});

router.post("/telemetry", requireLogin, (req, res) => {
    const satellite = req.body.satellite;

    const telemetryData = {
        "SISS-01": {
            temperature: "-18°C",
            battery: "84%",
            signal: "STABLE"
        },
        "ORION-4": {
            temperature: "-24°C",
            battery: "77%",
            signal: "STABLE"
        },
        "LUNA-3": {
            temperature: "-41°C",
            battery: "69%",
            signal: "WEAK"
        }
    };

    const data = telemetryData[satellite];

    res.render("telemetry", {
        result: data
            ? {
                satellite,
                ...data
            }
            : null
    });
});

module.exports = router;