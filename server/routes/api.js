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

const getCategory = async function (categoryId) {
    let conditions = {};
    if (categoryId) {
        conditions._id = categoryId;
    }
    return await db.Category.find(conditions);
}

const getCountCategory = async function (categoryId) {
    let conditions = {};
    let result = 0;
    if (categoryId) {
        conditions._id = categoryId;
    }
    await db.Category.find(conditions).count(function (err, count) {
        if (!err) {
            result = count;
        }
    });
    return result;
}

//#endregion

//#region "Product"

router.get('/product-count', async function (req, res) {
    let categoryId = req.query.categoryId;
    res.json(await countProduct(categoryId));
})

router.get('/product', async function (req, res) {
    let categoryId = req.query.categoryId;
    let str = `${categoryId}`;
    let nLimit = Number(req.query.nLimit);
    let nPage = Number(req.query.nPage);
    let fieldSort = req.query.fieldSort;
    let sortType = Number(req.query.sortType);
    getProducts(str, nLimit, nPage, fieldSort, sortType, (err, existCategory, nCount, products) => {
        if (err) {
            res.status(400);
            res.json({
                err: err
            });
        } else {
            res.status(200);
            res.json({
                existCategory: existCategory,
                count: nCount,
                products: products
            });
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
    await addProductToCategory(newProduct._id, req.body.categoryId);
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

const addProductToCategory = function (productId, categoryId) {
    return db.Product.findByIdAndUpdate(
        productId, {
            $set: {
                category: categoryId
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
        .populate('category', 'name priority -_id')
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
    let err = "";
    let category;
    let existCategory = true;
    let products = [];
    let conditions = {};
    let objSorts = {};
    let nSkip = 0;
    let nCount = 0;
    try {
        if (categoryId) {
            category = await db.Category.findById(categoryId, 'priority -_id').exec();
            if (category) {
                existCategory = true;
                if (category._doc.priority !== 1) {
                    conditions.category = categoryId;
                }
            } else {
                existCategory = false;
                callBack("", existCategory, 0, []);
                return;
            }
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
        await db.Product.countDocuments(conditions, (err, count) => {
            if (!err) {
                nCount = count;
            }
        });
        await db.Product.find(conditions)
            .populate('category')
            .populate('images')
            .sort(objSorts)
            .skip(nSkip)
            .limit(nLimit)
            .then(data => {
                products = data;
            })
            .catch(error => {
                err = error.message;
            });
        callBack(err, existCategory, nCount, products);
    } catch (ex) {
        callBack(ex, false, 0, []);
    }

}

const getProductsInCategory = function (categoryId) {
    return db.Product.find({
            category: categoryId
        })
        .populate('category', 'name -_id')
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

const countProduct = async function (categoryId, callBack) {
    let result = 0;
    let error = "";
    let objCondition = {};
    if (categoryId) {
        objCondition.category = categoryId;
    }
    await db.Product.countDocuments(objCondition, (err, count) => {
        if (!err) {
            result = count;
        } else {
            error = err.message;
        }
    });
    callBack(err, result);
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