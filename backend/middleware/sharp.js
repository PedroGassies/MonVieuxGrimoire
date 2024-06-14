const sharp = require('sharp');//optimised images
const fs = require('fs');

//  compress and resize the downloaded image   
module.exports = async (req, res, next) => {
    if (!req.file) {
        return next()
    };
    try {
        // Creating file name + path for compressed version
        req.file.compressedFilename = req.file.filename + '.webp';
        req.file.compressedFilePath = 'images/' + req.file.compressedFilename;

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