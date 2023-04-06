const express = require("express");
const connection = require("../connection");
const router = express.Router();
const auth = require("../services/authentication");
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
let uuid = require("uuid");

router.post("/generateReport", auth.authenticateToken, (req, res) => {
  const generateUuid = uuid.v1();
  const orderDetails = req.body;
  const productDetailReport = JSON.parse(orderDetails.productDetails);
  const query =
    "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values(?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [
      orderDetails.name,
      generateUuid,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      res.locals.email,
    ],
    (err, results) => {
      if (!err) {
        ejs.renderFile(
          path.join(__dirname, "", "report.ejs"),
          {
            productDetails: productDetailReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
          },
          (err, results) => {
            if (err) {
              return res.status(500).json(err);
            } else {
              pdf
                .create(results)
                .toFile(
                  "./generated_pdf/" + generateUuid + ".pdf",
                  (err, data) => {
                    if (err) {
                      console.log("err :>> ", err);
                      return res.status(500).json(err);
                    } else {
                      return res.status(200).json({ uuid: generateUuid });
                    }
                  }
                );
            }
          }
        );
      } else return res.status(500).json(err);
    }
  );
});



module.exports = router;
