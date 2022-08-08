const CartItem = require("../Models/CartItem");

exports.getCartItemsByUser = (req, res) => {
  CartItem.find({ user: req.profile._id, siteId: req.site._id })
    .populate("product stock")
    .exec((err, cis) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (cis.length < 1) {
        return res.status(400).json({
          status: 0,
          error: `No items found`,
        });
      }
      res.json(cis);
    });
};
exports.saveCartItem = (req, res) => {
  var ci = new CartItem(req.body);
  ci.siteId = req.site._id;
  ci.user = req.profile._id;
  CartItem.findOne(
    {
      user: ci.user,
      stock: req.body.stock,
      product: req.body.product,
      siteId: ci.siteId,
    },
    (err, oci) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (!oci) {
        ci.save((err, o) => {
          if (err) {
            return res.status(400).json({
              status: 0,
              error: `${err.message}`,
            });
          }
          res.json(o);
        });
      } else {
        oci.qty += 1;
        oci.save((err, o) => {
          if (err) {
            return res.status(400).json({
              status: 0,
              error: `${err.message}`,
            });
          }
          res.json(o);
        });
      }
    }
  );
};
exports.updateCartItem = (req, res) => {
  if (req.body.qty == 0) {
    CartItem.findByIdAndDelete(req.body._id, (err, doc) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json(doc);
    });
  } else {
    CartItem.findByIdAndUpdate(
      req.body._id,
      { $set: {qty:req.body.qty} },
      { new: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
        res.json(doc);
      }
    );
  }
};
