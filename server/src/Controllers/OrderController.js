const Coupoon = require("../Models/Coupoon");
const Order = require("../Models/Order");
const CartItem = require("../Models/CartItem");
const Razorpay = require("razorpay");
const { sendEmail } = require("../Services/EmailService");
const crypto = require("crypto");
const { notifyDevices } = require("../Services/FCMSercive");
exports.getOrderById = (req, res, next, id) => {
  Order.findOne({ _id: id, siteId: req.site._id }).exec((err, o) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    if (!o) {
      return res.status(400).json({
        status: 0,
        error: `No order found`,
      });
    }
    req.order = o;
    next();
  });
};
exports.getOrder = (req, res) => {
  res.json(req.order);
};
exports.getOrdersByUser = (req, res) => {
  Order.find({ user: req.profile._id, siteId: req.site._id })
    .sort([["createdAt", "desc"]])
    .limit(req.query.limit ? req.query.limit : 10)
    .skip(req.query.skip ? parseInt(req.query.skip) : 0)
    .exec((err, os) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json({ orders: os });
    });
};

exports.saveOrder = async (req, res) => {
  var o = new Order(req.body);
  var productOutOfStock = [];
  var coupoon;
  o.siteId = req.site._id;
  o.user = req.profile._id;
  if (req.body.coupoonApplied) {
    coupoon = await getCoupoonStatus(req, res);
  }
  var subTotal = 0;
  await CartItem.find({ siteId: req.site._id, user: req.profile._id })
    .populate("product stock")
    .then(
      (cItems) => {
        cItems.forEach((c) => {
          if (c.product && c.stock) {
            subTotal +=
              c.stock.sellPrice * c.qty;
            c.product.stocks=[c.stock]
            o.items.push({
              product: c.product,
              qty: c.qty,
            });
            c.remove((err, dc) => {});
          } else {
            // productOutOfStocfk.push({ productId: c.product._id });
          }
        });
      },
      (err) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err}`,
          });
        }
      }
    );
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
    res.json({order:o,productOutOfStock});
  });
};
exports.userUpdatesOrder = (req, res) => {
  var validUpdate = false;
  if (parseInt(req.body.status) > req.order.status) {
    //Canceled
    if (
      req.body.status == "10" &&
      !req.order.trackingId && //for third party couriers
      req.order.status < 6 //cannot cancel after delivery
    ) {
      req.order.status = 10;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
    }
    //Confirmed(UserAccepted)
    if (req.body.status == "2") {
      req.order.status = 2;
      req.order.userAccepted = 1;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
    }
  }
  if (validUpdate) {
    Order.findByIdAndUpdate(
      req.order._id,
      { $set: req.order },
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
  } else {
    res.status(400).json({ status: 0, error: "Invalid Update" });
  }
};
exports.updateOrder = async (req, res) => {
  var validUpdate = false;
  console.log(
    `Order ${req.order._id} updated by ${
      req.profile.username
    } at ${new Date().toLocaleString()}`
  );

  if (parseInt(req.body.status) > req.order.status) {
    //accepted
    if (req.body.status == "1") {
      req.order.status = 1;
      req.order.items = req.body.items;
      req.order.userAccepted = req.body.userAccepted;
      req.order.note = req.body.note;
      req.order.subTotal = req.body.subTotal;
      req.order.shippingCharges = req.body.shippingCharges;
      req.order.coupoonDiscount = req.body.coupoonDiscount;
      req.order.netAmount = req.body.netAmount;
      req.order.coupoon = req.body.coupoon;
      req.order.paymentId = req.body.paymentId;
      req.order.paymentStatus = req.body.paymentStatus;
      req.order.paymentUpdatedBy = req.profile.username;
      req.order.billingAddress = req.body.billingAddress;
      req.order.shippingAddress = req.body.shippingAddress;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;

      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Accepted`,
          text:`Order #${req.order.slNo} is accepted.`,
          image:"",
        }
      );
    }
    //packed
    if (req.body.status == "3") {
      req.order.status = 3;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Packed`,
          text:`Order #${req.order.slNo} is packed.`,
          image:"",
        }
      );
    }
    //shipped
    if (req.body.status == "4") {
      req.order.status = 4;
      req.order.courierPartner = req.body.courierPartner;
      req.order.trackingId = req.body.trackingId;
      req.order.billingAddress = req.body.billingAddress;
      req.order.shippingAddress = req.body.shippingAddress;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Shipped`,
          text:`Order #${req.order.slNo} is shipped.`,
          image:"",
        }
      );
    }
    //outfordelivery
    if (req.body.status == "5") {
      req.order.deliveryPartner = req.order.deliveryPartner;
      req.order.deliveryPersonName = req.order.deliveryPersonName;
      req.order.deliveryPersonMobile = req.order.deliveryPersonMobile;
      req.order.deliveryPersonUserId = req.order.deliveryPersonUserId;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Out For Delivery`,
          text:`Order #${req.order.slNo} is out for delivery.`,
          image:"",
        }
      );
    }
    //delivered
    if (req.body.status == "6") {
      req.order.status = 6;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Delivered`,
          text:`Order #${req.order.slNo} is delivered.`,
          image:"",
        }
      );
    }
    //returnrequest
    if (req.body.status == "7") {
      req.order.status = 7;
      req.order.returnNote = req.body.returnNote;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Return Requested`,
          text:`Return requested for Order #${req.order.slNo}. Our customer executive will call you shortly.`,
          image:"",
        }
      );
    }
    //returned
    if (req.body.status == "8") {
      req.order.status = 8;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Returned`,
          text:`Order #${req.order.slNo} is retured successfully.`,
          image:"",
        }
      );
    }
    // refunded
    if (req.body.status == "9") {
      req.order.status = 9;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Refurn Issued`,
          text:`Refund issued for Order #${req.order.slNo}.`,
          image:"",
        }
      );
    }
    //cancelled
    if (req.body.status == "10") {
      req.order.status = 10;
      req.order.statusLastUpdatedBy += req.profile.username + ",";
      validUpdate = true;
      await notifyDevices(
        req.site.name,
        req.profile.fcmTokens,
        {
          type: "order_update",
          title:`Order Cancelled`,
          text:`Order #${req.order.slNo} is is cancelled.`,
          image:"",
        }
      );
    }
  }
  if (validUpdate) {
    Order.findByIdAndUpdate(
      req.order._id,
      { $set: req.order },
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
  } else {
    res.status(400).json({ status: 0, error: "Invalid Update" });
  }
};

const getCoupoonStatus = (req, res) => {
  return new Promise((resolve, reject) => {
    Coupoon.findOne(
      { code: req.body.coupoonApplied, siteId: req.site._id },
      (err, cpn) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
        if (!cpn) {
          return res.status(400).json({
            status: 0,
            error: `Please check your coupoon code.`,
          });
        }
        if (cpn.validTill < Date.now()) {
          return res.status(400).json({
            status: 0,
            error: `Opps, Coupoon Expired.`,
          });
        }
        if (cpn.users.length > 0 && !cpn.users == req.profile.username) {
          return res.status(400).json({
            status: 0,
            error: `Opps, Coupoon Not Valid.`,
          });
        }
        if (cpn.status === 1) {
          return res.status(400).json({
            status: 0,
            error: `Opps, Coupoon was successfully used at ${cpn.usedAt.localDateString()}`,
          });
        }
        if (cpn.status === 2) {
          return res.status(400).json({
            status: 0,
            error: `Opps, Coupoon Expired.`,
          });
        }
        resolve(cpn);
      }
    );
  });
};

const createPayment = (order, req, res) => {
  var instance = new Razorpay({
    key_id: req.site.payKeyId,
    key_secret: req.site.payKeySecret,
  });
  var options = {
    amount: order.netAmount * 100,
    currency: order.currency,
    payment_capture: "1",
    receipt: order._id.toString(),
  };
  instance.orders.create(options, (err, resp) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }

    order.razorpayOrderId = resp.id;
    order.save((err, o) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json(o);
    });
  });
};
exports.updateOrderPaymentStatus = (req, res) => {
  var order = req.order;
  const hmac = crypto.createHmac("sha256", req.site.payKeySecret);
  hmac.update("" + order.razorpayOrderId + "|" + req.body.razorpay_payment_id);
  if (hmac.digest("hex") === req.body.razorpay_signature) {
    order.paymentId = req.body.razorpay_payment_id;
    order.razorpayPaymentSignature = req.body.razorpay_signature;
    order.paymentStatus = 1;
    order.save((err, savedOrder) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json(savedOrder);
    });
  }
};
exports.getOrdersForAdmin = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortby ? req.query.sortby : "_id";
  let sortType = req.query.sorttype ? req.query.sorttype : "desc";
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  var query = Order.find({ siteId: req.site._id })
    .sort([[sortBy, sortType]])
    .limit(limit)
    .skip(parseInt(skip));
  req.query.select ? query.select(req.query.select) : "";
  if (req.query._id) query.where("_id", req.query._id);
  if (req.query.fromDate)
    query.where("createdAt").gt(new Date(req.query.fromDate));
  if (req.query.toDate) query.where("createdAt").lt(new Date(req.query.toDate));
  if (req.query.paymentStatus)
    query.where("paymentStatus", parseInt(req.query.paymentStatus));
  if (req.query.pincode)
    query.where("shippingAddress.pincode").equals(req.query.pincode);
  if (req.query.trackingId)
    query.where("trackingId").equals(req.query.trackingId);
  if (req.query.paymentId) query.where("paymentId").equals(req.query.paymentId);
  query.exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    res.json(orders);
  });
};
