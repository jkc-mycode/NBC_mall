import Products from '../schemas/products.schema.js';

export default async (req, res, next) => {
    try {
        const { productId } = req.params;
        const idPattern = /^(?=.*[a-z])(?=.*[0-9]).{24}$/;

        if (!idPattern.test(productId)) {
            return res
                .status(404)
                .json({ status: 400, message: '상품 ID의 형식이 올바르지 않습니다. (영문 소문자, 숫자 24자)' });
        }

        const product = await Products.findById(productId, { password: true }).exec();

        if (!product) {
            return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
        }
        next();
    } catch (err) {
        next(err);
    }
};
