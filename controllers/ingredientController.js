const db = require("../lib/db.js");

exports.create = (req, res, next) => {
    db.query(`INSERT INTO ingredients (id, name) VALUES (NULL, ${db.escape(req.body.name)})`, (err, result) => {
        if (err) return res.status(400).send({ msg: err });

        return res.status(201).send({
            msg: "Zutat erstellt",
            zutat: { id: result.insertId, name: req.body.name },
        });
    });
};

exports.get_all = (req, res, next) => {
    db.query(`SELECT * FROM ingredients`, (err, result) => {
        if (err) return res.status(400).send({ msg: err });

        return res.status(200).send({
            msg: "Zutaten geladen",
            zutaten: result,
        });
    });
};

exports.get_by_id_or_name = (req, res, next) => {
    db.query(`SELECT * FROM ingredients WHERE id = ${db.escape(req.params.id)} OR name = ${db.escape(req.params.id)}`, (err, result) => {
        if (err) return res.status(400).send({ msg: err });

        return res.status(200).send({
            msg: "Zutat geladen",
            zutat: result[0],
        });
    });
};

exports.delete = (req, res, next) => {
    db.query(`DELETE FROM ingredients WHERE id = ${db.escape(req.params.id)}`, (err, result) => {
        if (err) return res.status(400).send({ msg: err });

        return res.status(200).send({
            msg: "Zutat gelöscht",
        });
    });
};