const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const alllistings = await listing.find({});
  res.render("./listings/index.ejs", { alllistings });
};

module.exports.renderNewListings = (req, res) => {
  res.render("./listings/newlistings.ejs");
};
module.exports.createNewListings = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New Listing Created");
  console.log(newlisting);
  res.redirect("/listings");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const showlisting = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!showlisting) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { showlisting });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const showlisting = await listing.findById(id);
  if (!showlisting) {
    req.flash("error", "Listing does not exist");
  }
  console.log(showlisting);
  let originalImage = showlisting.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { showlisting, originalImage });
};

module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
