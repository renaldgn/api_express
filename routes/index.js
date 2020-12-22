var db = require("../db_config");

var express = require('express');
var router = express.Router();

var DBNAME = 'ream';

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'ExpressRey' });
})

router.post('/login', function (req, res) {
	if (!req.body.username) {
		return res.status(404).send({"code":"404", "status":"bad request", "message":"username Tidak Boleh Kosong"});
	}
    if (!req.body.password) {
		return res.status(404).send({"code":"404", "status":"bad request", "message":"Password Tidak Boleh Kosong"});
	}
	
	db.connect(function(err) {
		let sql = "SELECT * FROM "+DBNAME+".user WHERE username='"+req.body.username+"' AND password=md5('"+req.body.password+"')";
		db.query(sql, function (err, result) {
			if (err) {
				console.log(err);
            }
            if (result.length > 0) {
                res.status(200).send({status:"berhasil", message:result[0].id});
            }else{
                res.status(201).send({status:"gagal", message:"Username atau password salah!"});
            }
		});
	});
})

router.get('/getUserLogin/:session_id', function (req, res) {
	if(!req.params.session_id) {
		return res.status(404).send({"code":"404", "status":"gagal", "message":"Session anda telah habis, silahkan login ulang"});
	}
	
	db.connect(function(err) {
		let sql = "SELECT * FROM "+DBNAME+".user WHERE id='"+req.params.session_id+"'";
		db.query(sql, function (err, result) {
			if (err) {
				console.log(err);
            }
            if (result.length > 0) {
                res.status(200).send({status:"berhasil", message:result[0]});
            }else{
                res.status(201).send({status:"gagal", message:req.params.session_id});
            }
		});
	});
})

router.post('/new-stock', function (req, res) {
	var nama_item      = req.body.nama_item;
	var jumlah_item    = req.body.jumlah_item;
	var harga_per_item = req.body.harga_per_item;
	
	if(!nama_item) {
	    return res.status(404).send({"code":"404", "status":"bad request", "message":"Nama item tidak boleh kosong"});
	}
	if(!jumlah_item) {
	    return res.status(404).send({"code":"404", "status":"bad request", "message":"Jumlah item tidak boleh kosong"});
	}
	if(!harga_per_item) {
	    return res.status(404).send({"code":"404", "status":"bad request", "message":"Harga per item tidak boleh kosong"});
	}

	db.connect(function(err) {	
	    let sql = "CALL "+DBNAME+".`sp_insert_stock`('"+nama_item+"', '"+jumlah_item+"', '"+harga_per_item+"')";
	    db.query(sql, function (err, result) {
	        if (err) {
	            res.status(201).send({status:"gagal", message:err});
	        }
	        if (result[0][0].status == 'berhasil') {
	            res.status(200).send({status:"berhasil", message:result[0][0].message});
	        }else{
	            res.status(201).send({status:"gagal", message:err});
	        }
	    });
	});
})

router.get('/get-stock', function (req, res) {
	db.connect(function(err) {
		let sql = "SELECT * FROM "+DBNAME+".stock";
		db.query(sql, function (err, result) {
			if (err) {
				console.log(err);
            }
            if (result.length > 0) {
                res.status(200).send({status:"berhasil", message:result});
            }else{
                res.status(201).send({status:"gagal", message:req.params.session_id});
            }
		});
	});
})

router.get('/get-stock/:stock_id', function (req, res) {
	if(!req.params.stock_id) {
		return res.status(404).send({"code":"404", "status":"gagal", "message":"Gagal mengambil id stock, silahkan ulangi"});
	}
	
	db.connect(function(err) {
		let sql = "SELECT * FROM "+DBNAME+".stock WHERE id='"+req.params.stock_id+"'";
		db.query(sql, function (err, result) {
			if (err) {
				console.log(err);
            }
            if (result.length > 0) {
                res.status(200).send({status:"berhasil", message:result[0]});
            }else{
                res.status(201).send({status:"gagal", message:req.params.session_id});
            }
		});
	});
})

router.post('/update-stock', function (req, res) {
	if(!req.body.stock_id) {
		return res.status(404).send({"code":"404", "status":"gagal", "message":"Gagal mengambil id stock, silahkan ulangi"});
	}
	
	db.connect(function(err) {
		let sql = "UPDATE "+DBNAME+".stock SET name='"+req.body.nama_item+"', qty='"+req.body.jumlah_item+"', price='"+req.body.harga_per_item+"' WHERE id='"+req.body.stock_id+"'";
		db.query(sql, function (err, result) {
			if (err) {
				res.status(201).send({status:"gagal", message:'Data gagal di perbarui'});
				console.log(err);
            }else {
                res.status(200).send({status:"berhasil", message:'Data berhasil di perbarui'});
            }
		});
	});
})
module.exports = router;
