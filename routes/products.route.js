import express from 'express';
import Products from '../schemas/products.schema.js';
import Joi from 'joi';

const router = express.Router();

// Joi 라이브러리를 이용한 유효성 검사
const createSchema = Joi.object({
    name: Joi.string().min(1).max(10).required(),
    description: Joi.string().min(1).max(100).required(),
    manager: Joi.string().min(2).max(10).required(),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$')),
    status: Joi.string().default('FOR_SALE'),
    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(null),
});

// 상품 등록 API
router.post('/products', async (req, res, next) => {
    try {
        // 유효성 검사를 마친후 상품 객체를 반환 받음
        const validation = await createSchema.validateAsync(req.body);
        // 객체 구조 분해 할당
        const { name, description, manager, password, status, createdAt, updatedAt } = validation;

        // 상품 정보 기입 여부 파악
        if (!name || !description || !manager || !password) {
            return res.status(400).json({ message: '상품 정보를 모두 입력해 주세요.' });
        }

        // 같은 상품명 있는지 체크
        const searchData = await Products.find({ name }).exec();
        if (searchData.length !== 0) {
            return res.status(400).json({ status: 400, message: '이미 등록 된 상품입니다.' });
        }

        // 상품 등록하기
        const products = new Products({
            name,
            description,
            manager,
            password,
            status,
            createdAt,
            updatedAt,
        });
        await products.save();

        return res.status(201).json({ status: 201, message: '상품 생성에 성공했습니다.', data: products });
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
router.get('/products/:productId', async (req, res, next) => {
    // url에서 productId 값 가져오기
    const { productId } = req.params;

    // 데이터베이스에서 productId 값 기반으로 상품 데이터 가져오기 (password는 빼고)
    const product = await Products.findById(productId, { password: 0 }).exec();

    if (!product) {
        return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
    }

    return res.status(200).json({ status: 200, message: '상품 상세 조회에 성공했습니다.', data: product });
});

// 상품 정보 수정 API (patch는 일부 수정할 때 사용)
router.patch('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { name, description, manager, status, password } = req.body;

        // 비밀번호를 입력하지 않았을 때
        if (!password) {
            return res.status(400).json({ status: 400, message: '비밀번호 입력을 필수입니다.' });
        }

        // 데이터베이스에서 productId 기반으로 데이터 가져오기
        const product = await Products.findById(productId).exec();

        if (!product) {
            return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
        }

        // 입력한 비밀번호와 상품 비밀번호가 같은지 확인
        if (password !== product.password) {
            return res.status(401).json({ status: 401, message: '비밀번호가 틀렸습니다.' });
        }

        // 상품 정보 수정
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
router.delete('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Products.findById(productId).exec();

        if (!product) {
            return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
        }

        // 해당 상품 삭제
        await Products.deleteOne({ _id: productId });

        return res.status(200).json({ status: 200, message: '상품 삭제에 성공했습니다.', data: { id: productId } });
    } catch (err) {
        next(err);
    }
});

export default router;
