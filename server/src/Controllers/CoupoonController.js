const Coupoon = require("../Models/Coupoon");
const { validateCoupoon } = require("../Services/CoupoonService");

exports.getCoupoonById = (req, res, next, id) => {
  Coupoon.findById(id, (err, cpn) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    if (!cpn) {
      return res.status(400).json({
        status: 0,
        error: `Opps, No coupoon found.`,
      });
    }
    req.coupoon = cpn;
    next();
  });
};

exports.saveCoupoon = (req, res) => {
  var cpn = new Coupoon(req.body);
  cpn.siteId = req.site._id;
  cpn.save((err, c) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    res.json(c);
  });
};

exports.getAllCoupoons = (req, res) => {
  Coupoon.find({}, (err, cpns) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    res.json(cpns);
  });
};

exports.getAllCoupoonForUser = (req, res) => {
  Coupoon.find(
    {
      status: 0,
      validTill: { $gte: new Date() },
      $or: [{ users: [] }, { users: req.profile.username }],
    },
    (err, cpns) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json(cpns);
    }
  );
};
