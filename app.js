const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require("path");
// const formidable = require('express-formidable');
var multer  = require('multer')
var upload = multer({ dest: 'public/' });

const app = express();
const port = 7070
const IPAddress = `127.0.0.1`

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(__dirname, 'public'));
// app.use(formidable());

let product = require('./src/product');

process.on("uncaughtException", e => {
  console.log("uncaughtException: " + e);
});

process.on("unhandledRejection", (e) => {
  console.log("unhandledRejection: " + e);
});

app.get('/', (req, res) => res.send('Welcome !!'))
app.get('/test', (req, res) => {
  res.send('Hello World! how are you !!')
});

app.get('/photo/:id', (req, res) => {
    var filename = req.params.id;
    var img = fs.readFileSync(path.resolve(__dirname, `public/${req.params.id}`));
    var encode_image = img.toString('base64');
    var orImg=new Buffer(encode_image, 'base64')
    res.contentType('image/jpeg');
   res.send(orImg)
  });

app.post('/saveproduct', upload.single('productFile'), (req, res) => {
    product.productSave(req.body,req.file.originalname,req.file.filename)
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  app.post('/allproduct', (req, res) => {
    product.getAllProduct(req.body)
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

app.listen(process.env.PORT || port, () => console.log(`Node-app listening at http://${IPAddress}:${port}`))