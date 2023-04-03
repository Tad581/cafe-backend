const express = require("express");
const connection = require("../connection");
const router = express.Router();

let auth = require("../services/authentication");
let checkRole = require("../services/checkRole");

router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const category = req.body;
    let query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Category added successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/get", auth.authenticateToken, (req, res, next) => {
  let query = "select * from category order by name";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const product = req.body;
    let query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Category id does not found" });
        }
        return res
          .status(200)
          .json({ message: "Category update successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

module.exports = router;
