const Category = require("../Models/Category");
const SubCategory = require("../Models/SubCategory");

exports.getSubCategoryById = (req, res, next, id) => {
  SubCategory.findOne({ _id: id, siteId: req.site._id }, (err, scate) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    if (!scate) {
      return res.status(400).json({
        status: 0,
        error: `No sub categories found`,
      });
    }
    req.subcategory = scate;
    next();
  });
};
exports.getSubCategory = (req, res) => {
  return res.json(req.subcategory);
};
exports.getAllSubCategoriesByCategoryId = (req, res) => {
  SubCategory.find({ category: req.category._id, siteId: req.site._id })
    .select("_id name dsc")
    .exec((err, scates) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (scates.length == 0) {
        return res.status(400).json({
          status: 0,
          error: `No sub categories found`,
        });
      }
      res.json(scates);
    });
};
exports.saveSubCategory = (req, res) => {
  var scate = new SubCategory(req.body);
  scate.siteId = req.site._id;
  scate.save((err, sc) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    // res.json(sc);
    Category.findById(sc.category, (err, c) => {
      c.subCategories.push(sc._id);
      c.save((err, c) => {
        if (err || !c) {
          return res.status(400).json(dbFailed);
        }
        res.json(sc);
      });
    });
  });
};
