const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//upload profileImg to couldinary
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

//upload postImg to couldinary
async function uploudPostImgCloudinary(image) {
  try {
    const data = await cloudinary.uploader.upload(image,{
      folder: "post_images",
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


//remove multiple images
async function removeMultiImgCloudinary(publicIds) {
  try {
    const data = await cloudinary.v2.api.delete_resources(publicIds);
    return data;
  } catch (err) {
    return err;
  }
}
module.exports = {uploudImgCloudinary , removeImgCloudinary,uploudPostImgCloudinary,removeMultiImgCloudinary};
