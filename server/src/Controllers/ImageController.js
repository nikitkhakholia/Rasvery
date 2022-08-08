const { query } = require("express");
const File = require("../Models/File");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const { Formidable } = require("formidable");
var async = require("async");
const { addUserFiles } = require("./UserController");
const { notifyDevices } = require("../Services/FCMSercive");
const UserService = require("../Services/UserService");

exports.uploadFile = (req, res) => {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    files.file.name =
      "" + Math.random().toString(36).substring(2) + files.file.name;
    var oldpath = files.file.path;
    var newpath = path.join("/upload/", "" + fields.for);

    if (await !fs.existsSync(newpath)) {
      await fs.mkdirSync(path.join(__dirname, "../../", newpath), {
        recursive: true,
      });
    }
    newpath += "/" + files.file.name;
    var file = new File();
    file.siteId = req.site._id;
    file.fileType = files.file.type;
    file.path = newpath;
    file.for = fields.for;
    file.forId = fields.forId;
    file.name = files.file.name;
    file.productIds = fields.productIds ? fields.productIds.split(",") : [];
    file.save("", (err, f) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      fs.rename(
        oldpath,
        path.join(__dirname, "../../", newpath),
        function (err) {
          if (err) {
            return res.status(400).json({
              status: 0,
              error: `${err.message}`,
            });
          }
          res.json({ _id: f._id, name: f.name });
        }
      );
    });
  });
};

exports.getFile = (req, res) => {
  if (req.query.fileId) {
    File.findOne(
      { _id: req.query.fileId, siteId: req.site._id },
      (err, file) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
        if (!file) {
          return res.status(400).json({
            status: 0,
            error: `FNF02`,
          });
        }
        res.sendFile(
          path.join(
            __dirname,
            "../../",
            file.path.replace("/home/ubuntu/ecommerce-backend-1.0/src", "")
          ),
          (err) => {
            if (err) {
              return res.status(400).json({
                status: 0,
                error: `FNF03~${err.status}~${err.message}`,
              });
            }
          }
        );
      }
    );
  } else {
    return res.status(400).json({
      status: 0,
      error: `FNF01`,
    });
  }
};

exports.multipleFileUpload = async (req, res) => {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    var success = true;
    var errorFiles = "";
    var generatedIds = "";
    async.forEachOf(
      files,
      async (incomingFile, key, done) => {
        incomingFile.name =
          "" + Math.random().toString(36).substring(2) + incomingFile.name;
        var oldpath = incomingFile.path;
        var newpath = path.join("/upload/", "" + fields.for);

        if (await !fs.existsSync(newpath)) {
          await fs.mkdirSync(path.join(__dirname, "../../", newpath), {
            recursive: true,
          });
        }

        newpath += "/" + incomingFile.name;
        var file = new File();
        file.siteId = req.site._id;
        file.fileType = incomingFile.type;
        file.path = newpath;
        file.for = fields.for;
        file.forId = fields.forId;
        file.name = incomingFile.name;
        file.productIds = fields.productIds ? fields.productIds.split(",") : [];
        file.save("", (err, f) => {
          if (err) {
            return res.status(400).json({
              status: 0,
              error: `${err.message}`,
            });
          }
          fs.rename(
            oldpath,
            path.join(__dirname, "../../", newpath),
            function (err) {
              if (err) {
                errorFiles += "" + key + ",";
              } else {
                generatedIds += "" + f._id + ",";
              }
              done();
            }
          );
        });
      },
      async (err) => {
        var x = await addUserFiles(
          generatedIds.length > 0
            ? generatedIds.substring(0, generatedIds.length-1).split(",")
            : [],
          req.profile,
          req.site._id
        );
        //after forloop completes
        if (success) {
          return res.json({
            success: 1,
            fileIds:
              generatedIds.length > 0
                ? generatedIds.substring(0, generatedIds.length-1)
                : "",
          });
        } else {
          return res.status(400).json({
            status: 0,
            fileIds:
              generatedIds.length > 0
                ? generatedIds.substring(0, generatedIds.length-1)
                : "",
            error: errorFiles,
          });
        }
      }
    );
  });
};

exports.linkProductToFile = (req, res) => {
  if (req.query.fileId && req.query.productIds.length > 0) {
    File.findOne({ _id: req.query.fileId, siteId: req.site._id }).exec(
      (err, file) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
        if (!file) {
          return res.status(400).json({
            status: 0,
            error: `File not found`,
          });
        }
        file.productIds = (
          file.productIds.join(",") +
          "," +
          req.query.productIds
        )
          .split(",")
          .filter((e) => {
            return e != null && e != "";
          });

        file.save((err, file) => {
          if (err) {
            return res.status(400).json({
              status: 0,
              error: `${err.message}`,
            });
          } else {
            return res.json({
              success: 1,
              productIds: file.productIds,
              fileId: file._id,
            });
          }
        });
      }
    );
  }
};
