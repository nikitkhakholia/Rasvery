const Site = require("../Models/Site");
exports.getSiteId = (req, res, next, siteName) => {
  Site.findOne({ name: siteName }, (err, siteDetails) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 0, error: "DB Failed! Try Again Later." });
    }
    if (!siteDetails) {
      return res.status(400).json({ status: 0, error: "Site Not Found" });
    }
    req.site = siteDetails;
    if(req.site.name==='dawaayi'){
      // setTimeout(()=>{
        next();
      // },2000)
      // },Math.floor((Math.random() * 3000) + 2000))
    }else{
      next();
    }
  });
};
