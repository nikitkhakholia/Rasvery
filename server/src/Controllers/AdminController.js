const CartItem = require("../Models/CartItem");
const Order = require("../Models/Order");
const { getCoupoonStatus } = require("./OrderController");
var async = require("async");


exports.createOrderByAdmin = async (req, res) => {
  var o = new Order(req.body);
  var productOutOfStock = [];
  var coupoon;
  o.siteId = req.site._id;
  o.user = req.body.userId;
  if (req.body.coupoonApplied) {
    coupoon = await getCoupoonStatus(req, res);
  }
  var subTotal = 0;
  var cItems;
  o.items = [];
  async.forEachOf(
    req.body.items,
    async (cartItem, key, done) => {
      var ci = new CartItem({
        product: cartItem.product,
        stock: cartItem.stock,
        qty: cartItem.qty,
      });
      await CartItem.populate(ci, "product stock");
      subTotal += ci.stock.sellPrice * ci.qty;
      ci.product.stocks = [ci.stock];
      o.items.push(ci);
      done();
    },
    (err) => {
      //after forloop completes

      o.subTotal = subTotal;
      if (coupoon && subTotal > coupoon.minCartValue) {
        o.coupoon = coupoon;
        o.coupoonDiscount =
          coupoon.discType == 0
            ? coupoon.discAmt
            : (subTotal * coupoon.discAmt) / 100;
        // o.coupoonDiscount =
        //   o.coupoonDiscount > coupoon.maxDisc ? coupoon.maxDisc : o.coupoonDiscount;
      }
      o.shippingCharges = o.subTotal - o.coupoonDiscount > 499 ? 0 : 29;
      o.netAmount = o.subTotal - o.coupoonDiscount + o.shippingCharges;
      o.save((err, o) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
        if (req.profile.email) {
          var mail = null;
          //email for dawaayi req.site._id === 1
          if (false) {
            var mail = req.site.mails.find((u) => u.for === "cs");
            mail = sendEmail({
              host: mail.host,
              port: mail.port,
              secure: mail.type,
              user: mail.user,
              pass: mail.pass,
              from: "Dawaayi Customer Service <" + mail.user + ">",
              to: req.profile.email,
              subject: `Your order is placed successfully.`,
              htmlBody: `<!DOCTYPE html>
                    <html>
                    <head>
                    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
                    <title></title>
                    <style>
                    body {
                        font-family: 'Poppins';
                    }
                    </style>
                    </head>
                    <body>
                    <h3 style='color:#E71D36;'>Your requested OTP!</h3>
                    ${JSON.stringify(o)}

                    </body>
                    </html>`,
              replyTo: "noreply@noreply.com",
            });
          }
        }
        res.json({ order: o, productOutOfStock });
      });
    }
  );
};
