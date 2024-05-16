import express from 'express';
import Products from '../schemas/products.schema.js';
import { createSchema, updateSchema, deleteSchema } from '../schemas/joi.schema.js';
import checkProductMiddleware from '../middlewares/check.product.middleware.js';

const router = express.Router();

// 상품 등록 API
router.post('/products', async (req, res, next) => {
    try {
        // 유효성 검사를 마친후 상품 객체를 반환 받음
        const validation = await createSchema.validateAsync(req.body);
        // 객체 구조 분해 할당
        const { name, description, manager, password } = validation;

        // 같은 상품명 있는지 체크
        const searchData = await Products.find({ name }).exec();
        if (searchData.length !== 0) {
            return res.status(400).json({ status: 400, message: '이미 등록 된 상품입니다.' });
        }

        // 상품 등록하기
        const product = new Products({
            name,
            description,
            manager,
            password,
            status: 'FOR_SALE',
            createdAt: new Date(),
            updatedAt: null,
        });
        await product.save();

        // 비밀번호는 제외하고 출력하기 위해 사용
        const copyProduct = JSON.parse(JSON.stringify(product));
        delete copyProduct.password;

        return res.status(201).json({ status: 201, message: '상품 생성에 성공했습니다.', data: copyProduct });
    } catch (err) {
        next(err);
    }
});

// 상품 목록 조회 API
router.get('/products', async (req, res, next) => {
    // 데이터베이스에서 상품 목록 데이터 가져오기 (password는 빼고)
    const productsList = await Products.find({}, { password: 0 }).sort('-createdAt').exec();

    return res.status(200).json({ status: 200, message: '상품 목록 조회에 성공했습니다.', data: productsList });
});

// 상품 상세 조회 API
router.get('/products/:productId', checkProductMiddleware, async (req, res, next) => {
    // url에서 productId 값 가져오기
    const { productId } = req.params;

    // 데이터베이스에서 productId 값 기반으로 상품 데이터 가져오기 (password는 빼고)
    const product = await Products.findById(productId, { password: 0 }).exec();

    return res.status(200).json({ status: 200, message: '상품 상세 조회에 성공했습니다.', data: product });
});

// 상품 정보 수정 API (patch는 일부 수정할 때 사용)
router.patch('/products/:productId', checkProductMiddleware, async (req, res, next) => {
    try {
        const { productId } = req.params;

        // 유효성 검사를 마친후 상품 객체를 반환 받음
        const validation = await updateSchema.validateAsync(req.body);
        // 객체 구조 분해 할당
        const { name, description, manager, password, status } = validation;

        // 데이터베이스에서 productId 기반으로 데이터 가져오기
        const product = await Products.findById(productId).exec();

        // 입력한 비밀번호와 상품 비밀번호가 같은지 확인
        if (password !== product.password) {
            return res.status(401).json({ status: 401, message: '비밀번호가 일치하지 않습니다.' });
        }

        // 같은 상품명 있는지 체크
        const searchData = await Products.find({ name }).exec();
        if (searchData.length !== 0) {
            return res.status(400).json({ status: 400, message: '이미 등록 된 상품입니다.' });
        }

        // 상품 정보 수정
        // 비밀번호를 제외한 나머지는 필수가 아니기에 기입이 되지 않으면 기본 값 사용
        product.name = name ? name : product.name;
        product.description = description ? description : product.description;
        product.manager = manager ? manager : product.manager;
        product.status = status ? status : product.status;
        product.updatedAt = new Date();
        await product.save();

        // 비밀번호는 제외하고 출력하기 위해 사용
        const copyProduct = JSON.parse(JSON.stringify(product));
        delete copyProduct.password;

        return res.status(200).json({ status: 200, message: '상품 수정에 성공했습니다.', data: copyProduct });
    } catch (err) {
        next(err);
    }
});

// 상품 정보 삭제 API
router.delete('/products/:productId', checkProductMiddleware, async (req, res, next) => {
    try {
        const { productId } = req.params;

        // 유효성 검사를 마친후 상품 객체를 반환 받음
        const validation = await deleteSchema.validateAsync(req.body);
        // 객체 구조 분해 할당
        const { password } = validation;

        const product = await Products.findById(productId).exec();

        // 입력한 비밀번호와 상품 비밀번호가 같은지 확인
        if (password !== product.password) {
            return res.status(401).json({ status: 401, message: '비밀번호가 일치하지 않습니다.' });
        }

        // 해당 상품 삭제
        await Products.deleteOne({ _id: productId });

        return res.status(200).json({ status: 200, message: '상품 삭제에 성공했습니다.', data: { id: productId } });
    } catch (err) {
        next(err);
    }
});

export default router;
