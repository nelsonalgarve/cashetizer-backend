// const express = require('express');
// const router = express.Router();
// const cloudinary = require('cloudinary').v2;
// const uniqid = require('uniqid');
// const fs = require('fs');

// router.post('/IDCheck', async (req, res) => {
// 	try {
// 		// Récupérer les fichiers envoyés depuis la requête
// 		const rectoImage = req.files.rectoID;
// 		const versoImage = req.files.versoID;
// 		const livePhoto = req.files.livePhoto;

// 		// Chemin pour enregistrer les images temporaires avant de les envoyer à Cloudinary
// 		const rectoPath = `/tmp/${uniqid()}_recto.jpg`;
// 		const versoPath = `/tmp/${uniqid()}_verso.jpg`;
// 		const livePhotoPath = `/tmp/${uniqid()}_live.jpg`;

// 		// Enregistrer les fichiers temporaires
// 		await rectoImage.mv(rectoPath);
// 		await versoImage.mv(versoPath);
// 		await livePhoto.mv(livePhotoPath);

// 		// Envoyer les fichiers à Cloudinary pour stockage
// 		const rectoResult = await cloudinary.uploader.upload(rectoPath);
// 		const versoResult = await cloudinary.uploader.upload(versoPath);
// 		const livePhotoResult = await cloudinary.uploader.upload(livePhotoPath);

// 		// Retourner les URLs des images stockées sur Cloudinary en réponse
// 		res.json({
// 			result: true,
// 			rectoIdUrl: rectoResult.secure_url,
// 			versoIdUrl: versoResult.secure_url,
// 			livePhotoUrl: livePhotoResult.secure_url,
// 		});

// 		// Supprimer les fichiers temporaires
// 		fs.unlinkSync(rectoPath);
// 		fs.unlinkSync(versoPath);
// 		fs.unlinkSync(livePhotoPath);
// 	} catch (error) {
// 		console.error("Erreur lors de l'enregistrement des images:", error);
// 		res.json({ result: false, error: "Erreur lors de l'enregistrement des images" });
// 	}
// });

// /* router.post('/testUpload', async (req, res) => {
//   const livePhotoPath = `./tmp/${uniqid()}.jpg`;
//   const resultMove = await req.files.photoFromFront.mv(livePhotoPath)

//   if (!resultMove) {
//     const livePhotoresultCloudinary = await cloudinary.uploader.upload(livePhotoPath);
//     res.json({ result: true, url: livePhotoresultCloudinary.secure_url });
//   } else {
//     res.json({ result: false, error: resultMove });
//   }

//   fs.unlinkSync(livePhotoPath);
//  }); */

// module.exports = router;
