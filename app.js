var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  mongoose = require("mongoose");

var app = express();

mongoose.connect('mongodb://localhost/ecomm_database');

app.configure(function () {
  app.use(express.bodyParser()); //automatically formats body of http request (parses as JSON for indexing)
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema;

var Product = new Schema({
  title: { type: String, required: true },
  description: { type: String, unique: true },
  style: { type: String, unique: true },
  modified: { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('Product', Product);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/ecomapi/public/index.html');
});

app.get('/api/products', function (req, res){ //req is an object based on user input
  return ProductModel.find(function (err, products) {
    if (!err) {
      var item = products[0].title;
      return res.send(item);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/products', function (req, res){
  var product;
  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    title: req.body.title,
    description: req.body.description,
    style: req.body.style,
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
});

app.get('/api/products/:id', function (req, res){
  return ProductModel.findById(req.params.id, function (err, product) {
    if (!err) {
      return res.send(product.title);
    } else {
      return console.log(err);
    }
  });
});

app.put('/api/products/:id', function (req, res){
  return ProductModel.findById(req.params.id, function (err, product) {
    product.title = req.body.title;
    product.description = req.body.description;
    product.style = req.body.style;
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(product);
    });
  });
});

app.delete('/api/products/:id', function (req, res){
  return ProductModel.findById(req.params.id, function (err, product) {
    return product.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.listen(4242, function () {
  console.log('Listening on 4242');
});
