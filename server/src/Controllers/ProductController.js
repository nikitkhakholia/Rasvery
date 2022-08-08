const Product = require("../Models/Product");
const Stock = require("../Models/Stock");
var async = require("async");
exports.getProductById = (req, res, next, id) => {
  Product.findOne({ _id: id, siteId: req.site._id })
    .populate("stocks")
    // .select("-subCategory")
    .exec((err, p) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (!p) {
        return res.status(400).json({
          status: 0,
          error: `No product found`,
        });
      }
      req.product = p;
      next();
    });
};
exports.getProduct = (req, res) => {
  res.json(req.product);
};
exports.getProductsBySubCategory = (req, res) => {
  Product.find({ subCategory: req.subcategory._id, siteId: req.site._id })
    .select("-image -subCategory")
    .populate("subCategory")
    .exec((err, ps) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (ps.length < 1) {
        return res.status(400).json({
          status: 0,
          error: `No products found`,
        });
      }
      res.json(ps);
    });
};
exports.saveProduct = (req, res) => {
  var p = new Product(req.body);
  p.siteId = req.site._id;
  p.save((err, p) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }

    Product.populate(p, { path: "stocks" }, (err, p) => {
      res.json(p);
    });
  });
};
exports.updateProduct = (req, res) => {
  Product.findByIdAndUpdate(
    req.product._id,
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      Product.populate(doc, { path: "stocks" }, (err, p) => {
        res.json(p);
      });
    }
  );
};
exports.getProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortby ? req.query.sortby : "_id";
  let sortType = req.query.sorttype ? req.query.sorttype : "desc";
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  var query = Product.find({ siteId: req.site._id })
    .sort([[sortBy, sortType]])
    .limit(limit)
    .skip(skip);
  req.query.select ? query.select(req.query.select) : "";
  query.populate("stocks");
  query.exec((err, ps) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    if (!ps.length > 0) {
      return res.status(400).json({
        status: 0,
        error: `No products found`,
      });
    }

    return res.json(ps);
  });
};
exports.addStock = (req, res) => {
  var stock = new Stock(req.body);
  stock.siteId = req.site._id;
  stock.save((err, stock) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    res.json({ stock: stock });
  });
};
exports.updateStock = (req, res) => {
  Stock.findByIdAndUpdate(
    req.body._id,
    { $set: req.body },
    { new: true },
    (err, stock) => {
      if (err || !stock) {
        return res.status(400).json({
          status: 0,
          error: err ? err.message : "Stock Not Found",
        });
      }
      res.json({ stock: stock });
    }
  );
};
exports.getProductsNames = (req, res) => {
  Product.find({
    siteId: req.site._id,
    name: new RegExp(req.query.search,"i"),
  })
    .select("name")
    .exec((err, ps) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (!ps.length > 0) {
        return res.status(400).json({
          status: 0,
          error: `No products found`,
        });
      }

      return res.json(ps);
    });
};
