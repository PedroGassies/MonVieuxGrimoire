const sharp = require('sharp');
const fs = require('fs');

// Middleware to compress the downloaded image in webp format, and to resize it
module.exports = async (req, res, next) => {
    // Check if an image file has been uploaded
    if (!req.file) {
        return next()
    };
    try {
        // Creating file name + path for compressed version
        req.file.compressedFilename = req.file.filename + '.webp';
        req.file.compressedFilePath = req.file.path + '.webp';

        await sharp(req.file.path)
            .resize({ width: 206, height: 260 })
            .webp(90)
            .toFile(req.file.compressedFilePath)

        // If the compression succeed, we just delete the original image
        fs.unlink(req.file.path, (error) => {
            if (error) console.log(error);
        });
        next();
    } catch (error) {
        res.status(403).json({ error });
    }
};