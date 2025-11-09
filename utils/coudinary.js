const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//upload image to couldinary
async function uploudImgCloudinary(image) {
  try {
    const data = await cloudinary.uploader.upload(image,{
      folder: "profile_images",
    });
    return data;
  } catch (err) {
    return err;
  }
}


//remove previos img
async function removeImgCloudinary(imageId) {
  try {
    const data = await cloudinary.uploader.destroy(imageId);
    return data;
  } catch (err) {
    return err;
  }
}
module.exports = {uploudImgCloudinary , removeImgCloudinary};
