const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

router.get(
    "/admin",
    requireLogin,
    (req, res) => {

        if (!req.session.user.isAdmin) {

            return res.status(403).render(
                "error",
                {
                    message: "ADMIN ACCESS REQUIRED"
                }
            );

        }

        res.render("admin", {

            username:
                req.session.user.username,

            flag:
                process.env.FLAG ||
                "FLAG{prototype_pollution_success}"
        });

    }
);

module.exports = router;