let dbQuery = require('../dbConfig/queryRunner');
let getAllProduct = body => new Promise((resolve, reject) => {
  let sql = `select * from product where prod_categary='${body.category}' and  prod_subcategary='${body.subcategory}' and isactive = 1`;
  dbQuery.queryRunner(sql)
    .then(result => {
      if (result && result.length != 0) {
        resolve({
          code: 200,
          message: "Product fetch Successfully.",
          data: result
        });
      } else {
        reject({
          code: 400,
          message: "Product Not found.",
          data: []
        });
      }
    })
    .catch(err => {
      reject(err);
    });
});

let checkProductExists = productCode => new Promise((resolve, reject) => {
  let sql = `select * from product where product_code='${productCode}' and isactive = 1`;
  dbQuery.queryRunner(sql)
    .then(result => {
      if (result && result.length != 0) {
        reject({
          code: 400,
          message: "product exist.",
          data: result
        });
      } else {
        resolve({
          code: 200,
          message: "product not exist",
          data: result
        });
      }
    })
    .catch(err => {
      reject({
        code: 400,
        message: err,
        data: []
      });
    });
});
let productSave = (reqBody,filename,file) => new Promise((resolve, reject) => {
  let userData = "";
  checkProductExists(reqBody.productCode)
    .then(result => {
      if (result.code == 200) {
        var sql = `INSERT INTO product(product_name,product_img_name,product_img,product_code,product_price,product_desc,isactive,prod_categary,prod_subcategary)
         VALUES('${reqBody.productName}','${filename}','${file}','${reqBody.productCode}',
         '${reqBody.productPrice}','${reqBody.productDesc}',1,'${reqBody.category}','${reqBody.subcategory}');`;
        return dbQuery.queryRunner(sql);
      } else {
        reject(result);
      }
    })
    .then(result => {
      if (result && result.length != 0) {
        resolve({
          code: 200,
          message: "Product Registered Successfully."
        });
      } else {
        reject({
          code: 400,
          message: "Product Not Registered.",
          data: []
        });
      }
    })
    .catch(err => {
      reject(err);
    });
});

module.exports = {
  productSave: productSave,
  getAllProduct:getAllProduct
}