import express from 'express';
import connect from './schemas/index.js';
import productsRouter from './routes/products.route.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';
import checkProductMiddleware from './middlewares/check.product.middleware.js';

const app = express();
const PORT = 3000;

connect();

app.use(express.json()); // req.body의 json 형태의 데이터를 읽기 위해서 사용
app.use(express.urlencoded({ extended: true })); // req.body의 form 데이터를 읽기 위해 사용

const router = express.Router();

router.get('/', (req, res) => {
    return res.json({ message: 'Hi!' });
});

// 여기서 상품ID를 체크하는 미들웨어 (여기서 라우터 건너뛰고 에러처리 미들웨어로 가도록)
// productsRouter.use('/products/:productId', checkProductMiddleware);

// http://localhost:3000/api 경로로 접근하는 경우에만
// json 미들웨어를 거친 뒤, router로 연결되도록 하는것
app.use('/api', [router, productsRouter]);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});
