const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

async function uploadPhotosToCloudinary(photoFiles) {
	console.log('photofiles_______________________________', photoFiles);
	const photoUrls = [];

	const processAndUpload = async (photo) => {
		const livePhotoPath = `/tmp/${uniqid()}.jpg`;
		const resultMove = await photo.mv(livePhotoPath);

		if (!resultMove) {
			const livePhotoResultCloudinary = await cloudinary.uploader.upload(livePhotoPath);
			photoUrls.push(livePhotoResultCloudinary.secure_url);
		} else {
			console.log("Erreur Upload d'image", resultMove);
		}

		fs.unlinkSync(livePhotoPath);
	};

	if (Array.isArray(photoFiles)) {
		for (let photo of photoFiles) {
			await processAndUpload(photo);
		}
	} else {
		await processAndUpload(photoFiles);
	}

	return photoUrls;
}

module.exports = uploadPhotosToCloudinary;
