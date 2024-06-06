const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp');

const stuffCtrl = require('../controlers/stuff'); // Assurez-vous que ce chemin est correct



/****************** POST REQUEST  ***********************/


router.post('/:id/rating', auth, stuffCtrl.rateBook);
router.post('/', auth, multer, sharp, stuffCtrl.addBook);


/***************** GET REQUEST  **********************/
router.get('/', stuffCtrl.getAllStuff);
router.get('/bestrating', stuffCtrl.bestRatingBooks);
router.get('/:id', stuffCtrl.getOneBook);


/****************** PUT REQUEST  **********************/
router.put('/:id', auth, multer, sharp, stuffCtrl.modifyBook);


/****************** DELETE REQUEST  **********************/
router.delete('/:id', auth, stuffCtrl.deleteBook);

module.exports = router 
