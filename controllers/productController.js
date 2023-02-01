const Product = require("../models/productModel")
const catchAsyncErrors = require("../middleware/catchasyncError")
const ApiFeatures = require("../utils/apiFeatures")

exports.createProduct = catchAsyncErrors(async(req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

exports.getAllProducts = catchAsyncErrors(async(req, res, next) => {
    const resultPerPage = 1;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();



    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);



    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});

//update 

exports.updateProduct = catchAsyncErrors(async(req, res) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json(product)
})

exports.deleteProduct = catchAsyncErrors(async(req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    await product.remove()

    res.status(200).json("product has been deleted")
})

exports.getProductDetails = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    res.status(200).json({
        success: true,
        product
    })
})

exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
    const { rating, comment, productId } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    const isReviewed = await product.reviews.find((rev) => rev.user.toString() === req.user._id)

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id)
                (rev.rating = rating), (rev.comment = comment)
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let avg = 0
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        product
    })

})

exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.id)


    if (!product) {
        return next(new ErrorHandler("Product doesnt exist ", 400))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })

})

exports.deleteProductReviews = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId)


    if (!product) {
        return next(new ErrorHandler("Product doesnt exist ", 400))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    const ratings = avg / reviews.length
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,

    })

})