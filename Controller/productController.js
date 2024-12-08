const productValidation = require("../Validation/productValidation");
const productRepo = require("../Repository/productRepo");
const userRepo = require("../Repository/userRepo");
const cartRepo = require("../Repository/cartRepo");
const path = require("path");

exports.homePage = async (req, res) => {
  try {
    const userInfo = await userRepo.userDetails(res.locals.userEmail);
    return res.status(200).render("home", {
      userName: userInfo.name,
      message: req.query.message,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const limit = 2;
    const pageNo = req.query.pageNo || 1;
    const userInfo = await userRepo.userDetails(res.locals.userEmail);
    const userProduct = await productRepo.userProduct(
      res.locals.userId,
      pageNo,
      limit,
    );

    const totalProductCount = await productRepo.countTotalProduct(
      res.locals.userId,
    );
    var totalPages = Math.ceil(totalProductCount / limit);

    const userProductInfo = userProduct.map((product) => {
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
      };
    });
    if (req.query.addToCartMessage) {
      return res.status(200).render("viewProduct", {
        userName: userInfo.name,
        userProductInfo,
        addToCartMessage: req.query.addToCartMessage,
        totalPages,
      });
    }
    return res.status(200).render("viewProduct", {
      userName: userInfo.name,
      userProductInfo,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { error } = productValidation.validate(req.body);
    if (error) {
      return res.status(200).render("error", { message: error.message });
    }
    const { name, price, description, category } = req.body;
    const checkIfProductNameExists =
      await productRepo.checkIfProductNameExists(name);
    if (checkIfProductNameExists) {
      return res.status(200).render("error", { message: "already exist" });
    }
    const imageFile = req.files.image;

    const uploadPath = path.join(
      __dirname,
      "..",
      "views",
      "public",
      "image",
      imageFile.name,
    );
    await imageFile.mv(uploadPath);

    await productRepo.addProduct({
      name,
      price,
      image: imageFile.name,
      description,
      category,
      userId: res.locals.userId,
    });
    return res.status(200).redirect(`/homePage?message="Added Successfully"`);
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.getUpdateProduct = async (req, res) => {
  try {
    const userProductData = await productRepo.productByProductId(
      req.query.productId,
    );
    const userInfo = await userRepo.userDetails(res.locals.userEmail);

    return res.status(200).render(`updateProduct`, {
      userProductData,
      userName: userInfo.name,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { error } = productValidation.validate(req.body);
    if (error) {
      return res.status(200).render("error", { message: error.message });
    }

    const { name, price, description, category, productId } = req.body;
    const isProductIdExist = await productRepo.isProductIdExist(productId);
    if (!isProductIdExist) {
      return res.status(200).render("error", { message: "Product Not Found" });
    }
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadPath = path.join(
        __dirname,
        "..",
        "views",
        "public",
        "image",
        imageFile.name,
      );
      await imageFile.mv(uploadPath);
      await productRepo.updateProduct(
        {
          name,
          price,
          image: imageFile.name,
          description,
          category,
          userId: res.locals.userId,
        },
        productId,
      );
    } else {
      await productRepo.updateProduct(
        {
          name,
          price,
          description,
          category,
          userId: res.locals.userId,
        },
        productId,
      );
    }
    return res.status(200).redirect(`/viewProduct`);
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!req.query.productId) {
      return res
        .status(500)
        .render("error", { message: "productId not Found" });
    }
    const isProductIdExist = await productRepo.isProductIdExist(
      req.query.productId,
    );
    if (!isProductIdExist) {
      return res.status(200).render("error", { message: "already deleted" });
    }
    await productRepo.deleteProduct(req.query.productId);

    //deleting the product from the cart
    if (await cartRepo.isCartProductIdExists(req.query.productId)) {
      await cartRepo.deleteCartProduct(req.query.productId);
    }
    return res.status(200).redirect(`/viewProduct`);
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.searchProductName = async (req, res) => {
  try {
    const productName = req.query.productName.trim();
    if (!productName) {
      return res.status(200).redirect("viewProduct");
    }
    const userInfo = await userRepo.userDetails(res.locals.userEmail);

    const userProduct = await productRepo.searchUserProduct(
      productName,
      res.locals.userId,
    );
    const userProductInfo = userProduct.map((product) => {
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
      };
    });
    return res.status(200).render("viewProduct", {
      userName: userInfo.name,
      userProductInfo,
      totalPages: 1,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.categorySearch = async (req, res) => {
  try {
    if (!req.query.category) {
      return res.status(200).redirect("viewProduct");
    }
    const userInfo = await userRepo.userDetails(res.locals.userEmail);

    const userProduct = await productRepo.searchUserProductCategory(
      req.query.category,
      res.locals.userId,
    );
    const userProductInfo = userProduct.map((product) => {
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
      };
    });
    return res.status(200).render("viewProduct", {
      userName: userInfo.name,
      userProductInfo,
      totalPages: 1,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};
