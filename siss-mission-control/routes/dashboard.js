const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) { //로그인한 사용자만 대시보드를 확인할 수 있게 함
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

router.get("/dashboard", requireLogin, (req, res) => {
    res.render("dashboard", {
        user: req.session.user
    });
});

module.exports = router;