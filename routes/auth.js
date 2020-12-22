var db = require("../db_config");
var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");


var DBNAME = 'db_mitra';
var secret_key = 'sKOMmfkodsmkFksfEoasnmsdjfo92834hrewi9fnvn9uern39u';

/* GET home page. */
router.get("/", (req, res, next) => {
    res.send({
        message: "Auth with JWT"
    });
});

router.get("/me", (req, res) => {

    var bearerHeader = req.headers["x-access-token"];
    if (typeof bearerHeader === "undefined")
        return res.status(401).send({
            auth: false,
            message: "Token tidak diketahui"
        });

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    // Verify jwt / token
    jwt.verify(bearerToken, secret_key, (err, authData) => {
        // Jika token salah
        if (err)
        return res.status(403).send({
            auth: false,
            message: err.message,
        });
        // Jika token bener
        res.status(200).send({
            auth: true,
            message: authData.data
        });
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "undefined" || password === "undefined" || username === '' || password === '') {
        return res.send({
            message: "Username atau Password tidak boleh kosong"
        });
    }
        
    db.connect(function(err) {
        let sql = "SELECT * FROM "+DBNAME+".mb_user WHERE no_hp='"+username+"' AND password=md5('"+password+"')";
        db.query(sql, function (err, result) {
            if (err) {
                console.log(err);
            }

            if (result.length > 0) {
                const secret = secret_key;
                const expiresIn = '1d';
                const data = result[0];

                jwt.sign({data}, secret, { algorithm: 'HS256', expiresIn : expiresIn}, (err, token) => {
                    res.send({
                        auth: true,
                        message: token
                    });
                });
            }else{
                res.send({
                    auth: false,
                    message: "Username atau password salah!"
                });
            }
        });
    });
});

router.post("/register", (req, res) => {
    const { nama, nohp, katasandi, ulangikatasandi } = req.body;

    if (nama === "undefined" || nohp === "undefined" || katasandi === "undefined" || ulangikatasandi === "undefined" || nama === '' || nohp === '' || katasandi === '' || ulangikatasandi === '') {
        return res.send({
            auth: false,
            message: "Form harus di isi semua"
        });
    }

    if(nohp.length < 11) {
        return res.send({
            auth: false,
            message: "Nomor hp tidak sesuai"
        });
    }

    if(katasandi.length < 6) {
        return res.send({
            auth: false,
            message: "Kata sandi minimal 6 karakter"
        });
    }

    if(katasandi !== ulangikatasandi) {
        return res.send({
            auth: false,
            message: "Kata sandi tidak sesuai"
        });
    }

    db.connect(function(err) {
        let check = "SELECT no_hp, IF(aktifasi='1', 'Aktif', 'Tidak Aktif') AS aktifasi FROM "+ DBNAME +".mb_user WHERE no_hp='"+nohp+"'";
        db.query(check, function (err, result) {
            if(result.length > 0) {
                return res.send({
                    auth: false,
                    message: "Nomor "+ result[0].no_hp +" telah terdaftar"
                });
            }else {
                let sql = "INSERT INTO " + DBNAME +".mb_user (nama, no_hp, password) VALUES ('"+nama+"', '"+nohp+"', md5('"+katasandi+"'))";
                db.query(sql, function (err, result) {
                    if (err) {
                        return res.send({
                            auth: false,
                            message: err
                        });
                    }
        
                    if(result) {
                        return res.send({
                            auth: true,
                            message: "Data anda berhasil kami terima, selanjutnya akan kami hubungi anda lewat telpon. Terima kasih"
                        });
                    } else{
                        return res.send({
                            auth: false,
                            message: "Data tidak terkirim, pastikan semua form di isi. Terima kasih"
                        });
                    }
                });
            }
        })
    })

})

module.exports = router;