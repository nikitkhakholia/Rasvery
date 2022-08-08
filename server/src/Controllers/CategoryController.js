const Category = require("../Models/Category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findOne({ _id: id, siteId: req.site._id }, (err, cate) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    if (!cate) {
      return res.status(400).json({
        status: 0,
        error: `No categories found`,
      });
    }
    req.category = cate;
    next();
  });
};
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find({ siteId: req.site._id })
    .select("_id name dsc subCategories")
    .populate("subCategories", "_id name")
    .exec((err, cates) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (cates.length == 0) {
        return res.status(400).json({
          status: 0,
          error: `No categories found`,
        });
      }
      res.json(cates);
    });
};
exports.saveCategory = (req, res) => {
  var cate = new Category(req.body);
  cate.siteId = req.site._id;
  cate.save((err, c) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    res.json(c);
  });
};
