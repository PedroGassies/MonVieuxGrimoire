const Book = require('../models/Book');
const fs = require('fs'); //file system, give acces to functionnality wich allows to midify files in our system 
const path = require('path');

//adding a book, and the image is added to the folder images
exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.compressedFilename}`,
        averageRating: bookObject.ratings[0].grade
    });
    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

//Delivers informations for all books
exports.getAllStuff = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

//Get information from a book
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(403).json({ message: "" }))
}

//modify information concerning the book, delete previous image in the folder images if a new one is added
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: ': unauthorized request' });
            } if (req.file) {
                const filename = book.imageUrl.split('/').pop();
                fs.unlink(`images/${filename}`)
            }
            else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié!' }))
                    .catch(error => res.status(403).json({ message: ': unauthorized request' }));
            }
        })
        .catch((error) => {
            res.status(403).json({ message: ': unauthorized request' });
        });
};

//delete book, and image from folder images
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: ': unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id }) //enlever l'image du folder images
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
                        .catch(error => res.status(403).json({ message: ': unauthorized request' }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

//Rating books, average rate, prevent user who posted book to note it twice
exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;
    const user = req.body.userId;

    if (user !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' })
    }
    Book.findById(req.params.id)
        .then(book => {
            const userRating = book.ratings.find(rating => rating.userId === userId);
            if (userRating) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' })
            }
            book.ratings.push({ userId, grade: rating })

            const totalRatings = book.ratings.length;
            const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            const averageRating = sumRatings / totalRatings;
            book.averageRating = averageRating;

            book.save()
                .then(updateBook => {
                    res.status(200).json(updateBook);
                })
                .catch(error => {
                    res.status(500).json({ error })
                })
        })
        .catch(error => {
            res.status(500).json({ error });
        })
}

//TopRating method
exports.bestRatingBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}
