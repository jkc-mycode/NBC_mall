import Products from '../schemas/products.schema.js';

export default async (req, res, next) => {
    const { productId } = req.params;

    try {
        const product = await Products.findById(productId, { password: true }).exec();

        if (!product) {
            return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
        }
        next();
    } catch (err) {
        next(err);
    }
};
