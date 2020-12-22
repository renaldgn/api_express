var db = require("../db_config");
var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");


var DBNAME = 'ream';
var secret_key = 'sKOMmfkodsmkFksfEoasnmsdjfo92834hrewi9fnvn9uern39u';

/* GET home page. */
router.get("/", (req, res, next) => {
    res.send({
        message: "Auth with JWT"
    });
});

router.delete("/delete:id_stock", (req, res) => {

    var bearerHeader = req.headers["x-access-token"];
    if (typeof bearerHeader === "undefined")
        return res.status(401).send({
            auth: false,
            message: "Harus ada token dulu bosque"
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
        // db.connect(function(err) {
        //     let sql = "UPDATE "+DBNAME+".stock SET name='"+req.body.nama_item+"', qty='"+req.body.jumlah_item+"', price='"+req.body.harga_per_item+"' WHERE id='"+req.body.stock_id+"'";
        //     db.query(sql, function (err, result) {
        //         if (err) {
        //             res.status(201).send({status:"gagal", message:'Data gagal di perbarui'});
        //             console.log(err);
        //         }else {
        //             res.status(200).send({status:"berhasil", message:'Data berhasil di perbarui'});
        //         }
        //     });
        // });
        res.status(200).send({
            auth: true,
            message: authData.data
        });
    });
});