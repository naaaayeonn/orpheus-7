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

    // 등록된 위성이면 바로 반환
    if (telemetryData[satellite]) {
        return res.render("telemetry", {
            result: { satellite, ...telemetryData[satellite] }
        });
    }

    // 등록 안 된 위성이면 외부 endpoint로 실시간 조회 시도
    // endpoint는 빈 객체 {}에서 꺼냄 → PP로 오염된 경우 값이 주입됨
    const config = {};
    const endpoint = config.endpoint; // ← PP로 Object.prototype.endpoint가 오염되면 여기서 값이 나옴

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