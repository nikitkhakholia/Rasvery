const Banner = require("../Models/Banner");
const BannerService = require("../Services/BannerService");

exports.addBanner = (req, res) => {
  var banner = new Banner(req.body);
  banner.siteId = req.site._id;
  banner.save((err, bnr) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    BannerService.cacheBanner(bnr.for, req, (e) => {
      if (!e) {
        CacheClient.get("banner_" + req.site._id + "_" + bnr.for , (e, bnrs) => {
          if (e || !bnrs) {
            res.json([]);
          } else {
            res.json(JSON.parse(bnrs));
          }
        });
      }
    });
  });
};
exports.getBanners = (req, res) => {
  CacheClient.get("banner_" + req.site._id + "_" + req.query.for , (e, bnrs) => {
    if (e || !bnrs) {
      res.json([]);
    } else {
      res.json(JSON.parse(bnrs));
    }
  });
};
// exports.getBannerById = (req, res, next, id) => {
//   Banner.findById(id).exec((err, bnr) => {
//     if (err) {
//       return res.status(400).json({
//         status: 0,
//         error: `${err.message}`,
//       });
//     }
//     if (!bnr) {
//       return res.status(400).json({
//         status: 0,
//         error: `No banner found`,
//       });
//     }
//     req.banner = bnr;
//     next();
//   });
// };
exports.deleteBanner = (req, res) => {
  Banner.findByIdAndDelete(req.query.bannerId).exec((err, bnr) => {
    if (err || !bnr) {
      return res.status(400).json({
        status: 0,
        error: `${err?err.message:""}`,
      });
    }
    BannerService.cacheBanner(bnr.for, req, (e) => {
      if (!e) {
        CacheClient.get("banner_" + req.site._id + "_" + bnr.for , (e, bnrs) => {
          if (e || !bnrs) {
            res.json([]);
          } else {
            res.json(JSON.parse(bnrs));
          }
        });
      }
    });
  });
};
