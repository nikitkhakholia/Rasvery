const Banner = require("../Models/Banner");

exports.cacheBanner = (bannerFor, req, next) => {
  Banner.find({ siteId: req.site._id, for: bannerFor })
    .select("-createdAt -updatedAt -__v")
    .exec((err, bnrs) => {
      if (err || !bnrs) {
        next(true);
      } else {
        CacheClient.set(
          "banner_" + req.site._id + "_" + bannerFor,
          JSON.stringify(bnrs),
          (e) => {
            next(false);
          }
        );
      }
    });
};
