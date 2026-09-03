const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

router.get("/telemetry", requireLogin, (req, res) => {
    res.render("telemetry", { result: null });
});

router.post("/telemetry", requireLogin, async (req, res) => {
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

    if (telemetryData[satellite]) {
        return res.render("telemetry", {
            result: { satellite, ...telemetryData[satellite] }
        });
    }

    const defaults = {};
    const endpoint = defaults.endpoint;

    if (!endpoint) {
        return res.render("telemetry", { result: null });
    }

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return res.render("telemetry", {
            result: { satellite, ...data }
        });
    } catch (err) {
        return res.render("telemetry", { result: null });
    }
});

module.exports = router;