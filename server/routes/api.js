const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const mongoose = require('mongoose')
const connectString = "mongodb://hieuvh:hieu2111@localhost:27017/oganishopdb"

const db = require('../models');

const SECRET_KEY = "mySecretKey";

mongoose.connect(connectString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connect to MongoDB'))
    .catch(err => console.error('Connection error', err));

router.get('/', (req, res) => {
    res.send('From API router')
})

//#region "JWT"
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) {
            return res.status(401).send('Unauthorized request')
        } else {
            req.userId = decode.subject
            next()
        }
    });
}

function getUserIDFromReq(req) {
    let userId = "";
    if (!req.headers.authorization) {
        return userId;
    }
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (!err) {
            userId = decode.subject;
        }
    });
    return userId;
}

//#endregion

//#region "Category"

router.get('/category', async function (req, res) {
    res.json(await db.Category.find({}).sort({
        priority: 1,
        name: 1
    }));
})

router.post('/category', async function (req, res) {
    let category = await createCategory({
        name: req.body.name,
        isActive: req.body.isActive
    });
    res.json(category)
})

const createCategory = function (category) {
    return db.Category.create(category).then(docCategory => {
        console.log("\n>> Created Category successfuly:\n", docCategory);
        return docCategory;
    }).catch(err => console.error("\n>> Created Category error:\n", err));
}

//#endregion

//#region "Product"

router.get('/product-count', async function (req, res) {
    let categoryId = req.query.categoryId;
    res.json(await countProduct(categoryId));
})

router.get('/product', async function (req, res) {
    let categoryId = req.query.categoryId;
    let nLimit = Number(req.query.nLimit);
    let nPage = Number(req.query.nPage);
    let fieldSort = req.query.fieldSort;
    let sortType = Number(req.query.sortType);
    getProducts(categoryId, nLimit, nPage, fieldSort, sortType, (err, categorys, conditions) => {
        if (err) {
            res.status(400);
            res.json({
                err: err
            });
        } else {
            res.status(200);
            res.json(categorys);
        }
    });
})

router.get('/product-detail', async function (req, res) {
    var productId = req.query.productId;
    getProduct(productId, (err, product) => {
        if (err) {
            res.status(400);
            res.json({
                err: err
            });
        } else {
            res.status(200);
            res.json(product);
        }
    })
})

router.post('/product', async function (req, res) {
    let newProduct = await createProduct({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });
    console.log(req.body.imageId);
    await addProductToCategory(newProduct._id, req.body.categoryIds);
    let product = await addImagesToProduct(req.body.imageIds, newProduct._id);
    res.json(product);
})

router.delete('/product/:_id', async function (req, res) {
    db.Product.deleteMany({
        _id: req.params._id
    }).then(function () {
        res.json({
            message: "Deleted data!"
        });
    }).catch(function (err) {
        res.json({
            err: err.message
        });
    })
})

router.get('/product/:categoryId', async function (req, res) {
    var products = await getProductsInCategory(req.params.categoryId);
    res.json(products);
})


router.get('/product-short', (req, res) => {

})

router.post('/product-push-imgs', async function (req, res) {
    res.json(await addImagesToProduct(req.body.imageIds, req.body._id));
})

const createProduct = function (product) {
    return db.Product.create(product).then(docProduct => {
        console.log("\n>> Created Product successfuly:\n", docProduct);
        return docProduct;
    }).catch(err => console.error("\n>> Created Product error:\n", err));
}

const addProductToCategory = function (productId, categoryIds) {
    return db.Product.findByIdAndUpdate(
        productId, {
            $push: {
                categories: {
                    $each: categoryIds
                }
            }
        }, {
            new: true,
            useFindAndModify: false
        }
    )
}

const getProduct = async function (productId, callBack) {
    var err = "";
    var ret = {};
    await db.Product.find({
            _id: productId
        })
        .populate('categories', 'name priority -_id')
        .populate('images', 'urlLink')
        .populate('uomWeight', 'name -_id')
        .populate('uomAvailability', 'name -_id')
        .then(product => {
            ret = product[0];
        })
        .catch(error => {
            err = error.message;
        })
    callBack(err, ret);
}

const getProducts = async function (categoryId, nLimit, nPage, fieldSort, sortType, callBack) {
    var err = "";
    var categorys = [];
    var conditions = {};
    var objSorts = {};
    var nSkip = 0;
    if (categoryId) {
        conditions.categories = categoryId;
    }
    if (!nLimit) {
        nLimit = 0;
    }
    if (!nPage) {
        nPage = 1;
    }
    if (fieldSort && sortType) {
        objSorts[fieldSort] = sortType;
    }
    nSkip = (nPage - 1) * nLimit;
    await db.Product.find(conditions)
        .populate('category')
        .populate('images')
        .sort(objSorts)
        .skip(nSkip)
        .limit(nLimit)
        .then(data => {
            categorys = data;
        })
        .catch(error => {
            err = error.message;
        });
    callBack(err, categorys, conditions);
}

const getProductsInCategory = function (categoryId) {
    return db.Product.find({
            categories: categoryId
        })
        .populate('categories', 'name -_id')
        .populate('images');
}

const addImagesToProduct = function (imageIds, productId) {
    return db.Product.findByIdAndUpdate(
        productId, {
            $push: {
                images: {
                    $each: imageIds
                }
            }
        }, {
            new: true,
            useFindAndModify: false
        }
    )
}

const countProduct = async function (categoryId) {
    var ret = 0;
    var objCondition = {};
    if (categoryId) {
        objCondition.categories = categoryId;
    }
    await db.Product.find(objCondition)
        .count(function (err, count) {
            if (err) {
                console.error(err.message);
            } else {
                ret = count;
            }
        })
    return ret;
}

//#endregion

//#region "Image"

router.get('/image', async function (req, res) {
    res.json(await db.Image.find({}));
})

router.post('/image', async function (req, res) {
    var newImage = await createImage({
        urlLink: req.body.urlLink,
        isActive: req.body.isActive
    })
    res.json(newImage);
})

const createImage = function (image) {
    return db.Image.create(image).then(docImage => {
        console.log("\n>> Created Image successfuly:\n", docImage);
        return docImage;
    }).catch(err => console.error("\n>> Created Image error:\n", err));
}

//#endregion

//#region Product-Cart

router.get('/product-cart', async function (req, res) {
    if (req.query.productIds) {
        var productIds = req.query.productIds.split(',');
        res.json(await getProductCart(productIds));
    } else {
        res.status(400);
        res.json({
            error: "Require productIds"
        });
    }
})

router.get('/data-product-cart', async function (req, res) {
    let userId = getUserIDFromReq(req);
    if (userId === "") {
        res.send(`"[]"`);
    } else {
        let productCart = await getDataProductCart(userId);
        if (productCart === null) {
            res.send(`"[]"`);
        } else {
            res.json(productCart.dataProductCart);
        }

    }
})

router.post('/product-cart', async function (req, res) {
    let userId = getUserIDFromReq(req);
    if (userId !== "") {
        let newProductCart = await upsertProductCart({
            user: userId,
            dataProductCart: req.body.dataProductCart
        });
        res.json(newProductCart);
    } else {
        res.status(401);
        res.json({
            error: "Unauthorized Error!"
        });
    }

})

const upsertProductCart = async function (productCart) {
    const filter = {
        user: productCart.user
    };
    const update = {
        dataProductCart: productCart.dataProductCart
    };
    let doc = await db.ProductCart.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
    }).catch(err => console.error("\n>> Add Or Update ProductCart error:\n", err));
    return doc;
}

const createProductCart = async function (productCart) {
    return db.ProductCart.create(productCart).then(docProductCart => {
        console.log("\n>> Created ProductCart successfuly:\n", docProductCart);
        return docProductCart;
    }).catch(err => console.error("\n>> Created ProductCart error:\n", err));
}

const getDataProductCart = async function (userId) {
    return await db.ProductCart.findOne({
            user: userId
        })
        .select('dataProductCart -_id');
}

const getProductCart = async function (productIds) {
    return await db.Product.find({
            _id: {
                $in: productIds
            }
        })
        .populate({
            path: 'images',
            select: 'urlLink -_id',
            options: {
                limit: 1,
                sort: [{
                    'urlLink': '1'
                }]
            }
        })
        .select('price name availability')
}

//#endregion

//#region "Authoriztion"

router.post('/login', (req, res) => {
    const MES_ERROR_INCORRECT = "The Username or Password is incorrect!"
    let userData = req.body;
    db.User.findOne({
        userName: userData.userName
    }, (error, user) => {
        if (error) {
            res.status(400);
            res.json({
                error: error.message
            });
        } else {
            if (!user) {
                res.status(400);
                res.json({
                    error: MES_ERROR_INCORRECT
                })
            } else {
                if (user.passWord !== userData.passWord) {
                    res.status(400);
                    res.json({
                        error: MES_ERROR_INCORRECT
                    })
                } else {
                    let payload = {
                        subject: user._id
                    };
                    let token = jwt.sign(payload, SECRET_KEY);
                    res.status(200);
                    res.json({
                        token: token
                    });
                }
            }
        }
    })
})

//#endregion

module.exports = router