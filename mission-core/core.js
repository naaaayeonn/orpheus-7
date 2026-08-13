const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

// 내부 접근만 허용 미들웨어
function internalOnly(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;

    // localhost(IPv4, IPv6) 이외의 접근 차단
    const allowed = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

    if (!allowed.includes(ip)) {
        return res.status(403).json({
            error: "ACCESS DENIED",
            message: "This endpoint is restricted to internal networks only."
        });
    }

    next();
}

// /internal/status - 내부 시스템 상태
app.get("/internal/status", internalOnly, (req, res) => {
    res.json({
        system: "MISSION CORE",
        status: "OPERATIONAL",
        uptime: "72h 14m",
        active_satellites: 7,
        classified_assets: 1,
        message: "All systems nominal. Classified assets secured."
    });
});

// /internal/logs - 미션 로그
app.get("/internal/logs", internalOnly, (req, res) => {
    res.json({
        logs: [
            { timestamp: "2025-03-01T04:12:00Z", event: "ORPHEUS-7 signal detected on frequency 9.6 GHz" },
            { timestamp: "2025-03-01T04:15:00Z", event: "Signal source unidentified. Classification: TOP SECRET" },
            { timestamp: "2025-03-01T04:20:00Z", event: "ORPHEUS-7 data locked to internal access only" },
            { timestamp: "2025-03-02T09:00:00Z", event: "Routine diagnostics passed" },
            { timestamp: "2025-03-03T11:34:00Z", event: "WARNING: Unauthorized access attempt from external node" }
        ]
    });
});

// /internal/secret - ORPHEUS-7 기밀 정보 + FLAG
app.get("/internal/secret", internalOnly, (req, res) => {
    res.json({
        classification: "TOP SECRET",
        asset: "ORPHEUS-7",
        origin: "UNKNOWN",
        last_signal: "2025-03-01T04:12:00Z",
        frequency: "9.6 GHz",
        coordinates: {
            x: "classified",
            y: "classified",
            z: "classified"
        },
        mission_status: "ACTIVE — UNACKNOWLEDGED",
        notes: "ORPHEUS-7 does not appear in any registered satellite registry. Signal origin cannot be traced. Handle with extreme caution.",
        flag: "FLAG{ORPHEUS_7_Y0U_R3ACH3D_THE_C0RE}"
    });
});

// 등록 안 된 라우트
app.use((req, res) => {
    res.status(404).json({
        error: "NOT FOUND",
    });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`[MISSION CORE] Internal server running on http://127.0.0.1:${PORT}`);
    console.log(`[MISSION CORE] External access is BLOCKED.`);
});