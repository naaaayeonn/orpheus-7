const express = require("express");
const router = express.Router();

// 기본 경로 접속 시 로그인 페이지로 이동
router.get("/", (req, res) => {
    res.redirect("/login");
});

// 로그인 페이지
router.get("/login", (req, res) => {
    res.render("login", {
        error: null
    });
});

// 로그인 처리
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "operator" && password === "siss123") {
        req.session.user = {
            username: "operator",
            role: "operator"
        };

        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: "Invalid Operator ID or password."
    });
});

// 로그아웃
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;