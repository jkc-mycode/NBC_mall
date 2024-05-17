# 🖥️ 나만의 내배캠 장터 백엔드 서버 만들기
![썸네일](./imgs/thumbnail.png)

## 프로젝트 소개
- 프로젝트 이름 : NBC_Mall
- 내용 : Node.js와 Express.js를 활용한 나만의 내배캠 장터 백엔드 서버 만들기
- 구분 : 개인 프로젝트
- 배포 : [http://mymycode.shop:3000/api/products/](http://mymycode.shop:3000/api/products/)

<br>

## 필수 구현 내용
### 설계

- [x]  API 명세서를 해석할 수 있으며, 직접 작성할 수 있습니까?

### 개발 (준비)

- [x]  `README.md`, `.env`, `.gitignore`, `.prettierrc` 파일이 있습니까?

### 개발 (필수)

- [x]  상품 생성 API를 구현했나요?
- [x]  상품 목록 조회 API를 구현했나요?
- [x]  상품 상세 조회 API를 구현했나요?
- [x]  상품 수정 API를 구현했나요?
- [x]  상품 삭제 API를 구현했나요?

### 테스트

- [x]  구현 된 모든 API를 Insomnia를 이용해서 테스트 했나요?

### 배포

- [x]  AWS EC2에 프로젝트를 배포했나요?
- [x]  터미널을 빠져 나와서 서버가 계속 실행될 수 있게 PM2로 실행했나요?
- [x]  IP 또는 도메인으로 접속 했을 때 정상 동작하나요?

### 더 고민해 보기

- [x]  모든 질문에 답변을 작성했나요?

<br>

## 1. 개발 기간
- 2024.05.15 ~ 2024.05.16

<br>

## 2. 개발 환경
- BackEnd : Node.js, Express, MongoDB
- Tool : AWS, Insomnia, Studio 3T

<br>

## 3. API 명세서 (예시)
 - https://west-territory-778.notion.site/API-69097aadc880485dac4567cb7e26e423?pvs=4

<br>

## 4. 주요 기능
### 4-1. 요구 사항 파악 및 스키마 정의
- MongoDB 스키마 정의
```javascript
import mongoose from 'mongoose';

const productsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    manager: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
});

export default mongoose.model('Products', productsSchema);
```

<br>

### 4-2. 상품 생성 API
- **상품명, 상품 설명, 담당자, 비밀번호를 Request body(req.body)로** 전달 받음

- 상품 ID는 전달 받지 않고, 자동으로 생성 (_id)

- 상품 상태는 **판매 중(FOR_SALE)및 판매 완료(SOLD_OUT)만** 가능

- 상품 등록 시 기본 상태는 판매 중(FOR_SALE)

- 생성 일시, 수정 일시를 자동으로 생성
```javascript
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
```

<br>

### 4-3. 상품 목록 조회 API
- **상품 ID, 상품명, 상품 설명, 담당자, 상품 상태, 생성 일시, 수정 일시**를 조회

- **비밀번호**를 포함X

- 생성 일시를 기준으로 **내림차순(최신순) 정렬**
```javascript
// 상품 목록 조회 API
router.get('/products', async (req, res, next) => {
    // 데이터베이스에서 상품 목록 데이터 가져오기 (password는 빼고)
    const productsList = await Products.find({}, { password: 0 }).sort('-createdAt').exec();

    return res.status(200).json({ status: 200, message: '상품 목록 조회에 성공했습니다.', data: productsList });
});
```

<br>

### 4-4. 상품 상세 조회 API
- **상품 ID를 Path Parameter(req.params)로** 전달 받음

- **상품 ID, 상품명, 상품 설명, 담당자, 상품 상태, 생성 일시, 수정 일시**를 조회

- **비밀번호**를 포함X
```javascript
// 상품 상세 조회 API
router.get('/products/:productId', checkProductMiddleware, async (req, res, next) => {
    // url에서 productId 값 가져오기
    const { productId } = req.params;

    // 데이터베이스에서 productId 값 기반으로 상품 데이터 가져오기 (password는 빼고)
    const product = await Products.findById(productId, { password: 0 }).exec();

    return res.status(200).json({ status: 200, message: '상품 상세 조회에 성공했습니다.', data: product });
});
```


<br>

### 4-5. 상품 수정 API
- **상품 ID를 Path Parameter(req.params)로** 전달 받음

- **상품명, 상품 설명, 담당자, 상품 상태, 비밀번호를 Request body(req.body)로** 전달 받음

- 수정할 상품과 **비밀번호 일치 여부**를 확인
```javascript
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
```

<br>

### 4-6. 상품 삭제 API
- **상품 ID를 Path Parameter(req.params)로** 전달 받음

- **비밀번호를 Request body(req.body)로** 전달 받음

- 삭제할 상품과 **비밀번호 일치 여부**를 확인


<br>

### 4-7. 에러 처리 (에러 처리 미들웨어)
- **상품 상세 조회, 수정, 삭제 시 상품이 없는 경우**에 사용하는 에러 처리 미들웨어
```javascript
import Products from '../schemas/products.schema.js';

export default async (req, res, next) => {
    const { productId } = req.params;

    try {
        const product = await Products.findById(productId).exec();

        if (!product) {
            return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
        }
        next();
    } catch (err) {
        next(err);
    }
};
```

<br>

### 4-8. 유효성 검증 (Joi)
- 상품 등록, 수정, 삭제 시 사용하는 유효성 검사가 달라서 따로 구현
```javascript
import Joi from 'joi';

// Joi 라이브러리를 이용한 상품 등록 유효성 검사
export const createSchema = Joi.object({
    name: Joi.string().min(1).max(10).required().messages({
        'string.base': 'name은 문자열이어야 합니다.',
        'string.max': 'name은 최대 10글자여야 합니다.',
        'string.min': 'name은 최소 1글자여야 합니다.',
        'string.empty': 'name을 입력해주세요.',
        'any.required': 'name을 입력해주세요.',
    }),
    description: Joi.string().min(1).max(100).required().messages({
        'string.base': 'description은 문자열이어야 합니다.',
        'string.max': 'description은 최대 100글자여야 합니다.',
        'string.min': 'description은 최소 1글자여야 합니다.',
        'string.empty': 'description을 입력해주세요.',
        'any.required': 'description을 입력해주세요.',
    }),
    manager: Joi.string().min(2).max(10).required().messages({
        'string.base': 'manager는 문자열이어야 합니다.',
        'string.max': 'manager는 최대 10글자여야 합니다.',
        'string.min': 'manager는 최소 2글자여야 합니다.',
        'string.empty': 'manager를 입력해주세요.',
        'any.required': 'manager를 입력해주세요.',
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$'))
        .messages({
            'string.base': 'password는 문자열이어야 합니다.',
            'string.empty': 'password를 입력해주세요.',
            'any.required': 'password를 입력해주세요.',
            'string.pattern.base': 'password가 형식에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~15자)',
        }),
    status: Joi.string().default('FOR_SALE').valid('FOR_SALE', 'SOLD_OUT').messages({
        'string.base': 'status는 문자열이어야 합니다.',
        'any.only': 'status는 [FOR_SALE, SOLD_OUT] 중 하나여야 합니다.',
    }),
});

// Joi 라이브러리를 이용한 상품 정보 수정 유효성 검사
export const updateSchema = Joi.object({
    name: Joi.string().min(1).max(10).messages({
        'string.base': '상품명(name)은 문자열이어야 합니다.',
        'string.max': '상품명(name)은 최대 10글자여야 합니다.',
        'string.min': '상품명(name)은 최소 1글자여야 합니다.',
    }),
    description: Joi.string().min(1).max(100).messages({
        'string.base': '상품설명(description)은 문자열이어야 합니다.',
        'string.max': '상품설명(description)은 최대 100글자여야 합니다.',
        'string.min': '상품설명(description)은 최소 1글자여야 합니다.',
    }),
    manager: Joi.string().min(2).max(10).messages({
        'string.base': '관리자(manager)는 문자열이어야 합니다.',
        'string.max': '관리자(manager)는 최대 10글자여야 합니다.',
        'string.min': '관리자(manager)는 최소 2글자여야 합니다.',
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$'))
        .messages({
            'string.base': '비밀번호(password)는 문자열이어야 합니다.',
            'string.empty': '비밀번호(password)를 입력해주세요.',
            'any.required': '비밀번호(password)를 입력해주세요.',
            'string.pattern.base': '비밀번호(password)가 형식에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~15자)',
        }),
    status: Joi.string().valid('FOR_SALE', 'SOLD_OUT').messages({
        'string.base': '상품상태(status)는 문자열이어야 합니다.',
        'any.only': '상품상태(status)는 [FOR_SALE, SOLD_OUT] 중 하나여야 합니다.',
    }),
});

// Joi 라이브러리를 이용한 상품 삭제 유효성 검사
export const deleteSchema = Joi.object({
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$'))
        .messages({
            'string.base': '비밀번호(password)는 문자열이어야 합니다.',
            'string.empty': '비밀번호(password)를 입력해주세요.',
            'any.required': '비밀번호(password)를 입력해주세요.',
            'string.pattern.base': '비밀번호(password)가 형식에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~15자)',
        }),
});
```

<br>

## 5. 테스트 사진 첨부
- 상품 등록 API
![상품 등록 API](https://velog.velcdn.com/images/my_code/post/78168c37-8d62-434a-8c60-2444be525277/image.png)

- 상품 목록 조회 API
![상품 목록 조회 API](https://velog.velcdn.com/images/my_code/post/e285cc8a-9fa3-4dbf-bf8a-13197601d03b/image.png)

- 상품 상세 조회 API
![상품 상세 조회 API](https://velog.velcdn.com/images/my_code/post/dc365eff-9702-4a3e-810f-d008e6994876/image.png)

- 상품 수정 API
![상품 수정 API](https://velog.velcdn.com/images/my_code/post/cb09bd1e-50de-4afe-9781-1f587c85a636/image.png)

- 상품 삭제 API
![상품 삭제 API](https://velog.velcdn.com/images/my_code/post/0add3cf1-20e2-4406-a8aa-60a8a2565464/image.png)

- AWS E2C + Gabia를 통해 배포
![AWS E2C + Gabia를 통해 배포](./img/pagination_result.png)


<br>

## 6. 어려웠던 점
### 6-1. 에러처리 중 중복된 코드가 보임
- 상품의 ID 값을 req.params로 받아서 사용함

- 상품의 ID를 이용해서 데이터베이스에서 해당 상품이 있는지 판별함

- 이 코드가 짧긴해도 상품 상세 조회, 상품 수정, 상품 삭제 API에서 모두 사용되는 에러 처리 코드

- 그래서 이 중복되는 코드를 미들웨어로 빼서 공통적으로 적용시키는 방법을 모색함

- 튜터님께서 말씀해주신 방법은 해당 라우터가 실행되기 전에 미들웨어로 에러처리를 하라고 하셨음

- 하지만 클라이언트에게 중복되게 출력하는 문제 때문에 다른 방법을 찾음

- 바로 직접 router.get(...) 코드 안에 미들웨어를 넣어서 동작시키는 방법을 사용함
```javascript
// /middlewares/check.product.middleware.js

import Products from '../schemas/products.schema.js';

export default async (req, res, next) => {
    const { productId } = req.params;

    try {
        const product = await Products.findById(productId).exec();

        if (!product) {
            return res.status(404).json({ status: 404, message: '상품이 존재하지 않습니다.' });
        }
        next();
    } catch (err) {
        next(err);
    }
};
```

```javascript
// /routes/products.route.js

// 상품 상세 조회 API
router.get('/products/:productId', checkProductMiddleware, async (req, res, next) => {
    // url에서 productId 값 가져오기
    const { productId } = req.params;

    // 데이터베이스에서 productId 값 기반으로 상품 데이터 가져오기 (password는 빼고)
    const product = await Products.findById(productId, { password: 0 }).exec();

    return res.status(200).json({ status: 200, message: '상품 상세 조회에 성공했습니다.', data: product });
});
```
- 위 코드처럼 `checkProductMiddleware`를 사용하면 라우터가 실행되기 전에 `checkProductMiddleware` 미들웨어가 동작 후 라우터 안의 코드들이 동작함

<br>

### 6-2. 입력받은 내용마다 에러처리를 해야해서 코드가 길어짐
- 기존에는 Joi 라이브러리를 통해서 Joi가 생성해주는 에러 메시지를 사용함

- 하지만 조금 더 가독성 좋은 에러 메시지를 위해서 다른 방법을 모색함

- 결국 Joi 라이브러리에서 커스텀 메시지를 작성하는 메서드를 제공함

- 그래서 에러 처리 핸들러에서 isJoi를 통해서 에러가 Joi를 통해서 들어온 에러인지 판별함

- Joi의 커스텀 에러 메시지를 사용하면 각 에러마다 나만의 에러 메시지를 사용할 수 있음

- 하지만 내용에 따라서 길어질 수 있기에 파일을 따로 관리하는 게 좋음

- https://velog.io/@mero/joi-messages-%EA%B8%B0%EB%8A%A5-%ED%99%9C%EC%9A%A9

- https://joi.dev/api/?v=17.13.0
```javascript
import Joi from 'joi';

// Joi 라이브러리를 이용한 상품 등록 유효성 검사
export const createSchema = Joi.object({
    name: Joi.string().min(1).max(10).required().messages({
        'string.base': 'name은 문자열이어야 합니다.',
        'string.max': 'name은 최대 10글자여야 합니다.',
        'string.min': 'name은 최소 1글자여야 합니다.',
        'string.empty': 'name을 입력해주세요.',
        'any.required': 'name을 입력해주세요.',
    }),
    description: Joi.string().min(1).max(100).required().messages({
        'string.base': 'description은 문자열이어야 합니다.',
        'string.max': 'description은 최대 100글자여야 합니다.',
        'string.min': 'description은 최소 1글자여야 합니다.',
        'string.empty': 'description을 입력해주세요.',
        'any.required': 'description을 입력해주세요.',
    }),
    manager: Joi.string().min(2).max(10).required().messages({
        'string.base': 'manager는 문자열이어야 합니다.',
        'string.max': 'manager는 최대 10글자여야 합니다.',
        'string.min': 'manager는 최소 2글자여야 합니다.',
        'string.empty': 'manager를 입력해주세요.',
        'any.required': 'manager를 입력해주세요.',
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$'))
        .messages({
            'string.base': 'password는 문자열이어야 합니다.',
            'string.empty': 'password를 입력해주세요.',
            'any.required': 'password를 입력해주세요.',
            'string.pattern.base': 'password가 형식에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~15자)',
        }),
    status: Joi.string().default('FOR_SALE').valid('FOR_SALE', 'SOLD_OUT').messages({
        'string.base': 'status는 문자열이어야 합니다.',
        'any.only': 'status는 [FOR_SALE, SOLD_OUT] 중 하나여야 합니다.',
    }),
});

// Joi 라이브러리를 이용한 상품 정보 수정 유효성 검사
export const updateSchema = Joi.object({
    name: Joi.string().min(1).max(10).messages({
        'string.base': '상품명(name)은 문자열이어야 합니다.',
        'string.max': '상품명(name)은 최대 10글자여야 합니다.',
        'string.min': '상품명(name)은 최소 1글자여야 합니다.',
    }),
    description: Joi.string().min(1).max(100).messages({
        'string.base': '상품설명(description)은 문자열이어야 합니다.',
        'string.max': '상품설명(description)은 최대 100글자여야 합니다.',
        'string.min': '상품설명(description)은 최소 1글자여야 합니다.',
    }),
    manager: Joi.string().min(2).max(10).messages({
        'string.base': '관리자(manager)는 문자열이어야 합니다.',
        'string.max': '관리자(manager)는 최대 10글자여야 합니다.',
        'string.min': '관리자(manager)는 최소 2글자여야 합니다.',
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$'))
        .messages({
            'string.base': '비밀번호(password)는 문자열이어야 합니다.',
            'string.empty': '비밀번호(password)를 입력해주세요.',
            'any.required': '비밀번호(password)를 입력해주세요.',
            'string.pattern.base': '비밀번호(password)가 형식에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~15자)',
        }),
    status: Joi.string().valid('FOR_SALE', 'SOLD_OUT').messages({
        'string.base': '상품상태(status)는 문자열이어야 합니다.',
        'any.only': '상품상태(status)는 [FOR_SALE, SOLD_OUT] 중 하나여야 합니다.',
    }),
});

// Joi 라이브러리를 이용한 상품 삭제 유효성 검사
export const deleteSchema = Joi.object({
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$'))
        .messages({
            'string.base': '비밀번호(password)는 문자열이어야 합니다.',
            'string.empty': '비밀번호(password)를 입력해주세요.',
            'any.required': '비밀번호(password)를 입력해주세요.',
            'string.pattern.base': '비밀번호(password)가 형식에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~15자)',
        }),
});
```

<br>

### 6-3. 리눅스에서 app.js 서버를 켜면 몽고DB 에러 발생
![리눅스 에러 화면](https://velog.velcdn.com/images/my_code/post/caae3b4f-1ce2-41e5-be0e-5cbca7800aab/image.png)
- 리눅스 서버를 통해서 서버를 실행하려고 하니 위와 같은 에러가 발생함

- 튜터님께 여쭤보니 .env 파일을 통해서 몽고DB의 URI값을 관리하는데, .env 파일은 .gitignore에 등록했기 때문에 리눅스 서버 상에는 존재하지 않아서 에러가 발생한다고 말씀하셨음

- 즉, 리눅스 서버에도 .env 파일이 필요하다는 뜻

- 그래서 리눅스 명령어를 통해서 직접 .env 파일을 만들어서 몽고DB의 URI값을 넣어줌

- `vim .env //파일이 없으면 생성, 있으면 수정 또는 추가`
```bash
i ##입력모드로 전환
:q ## 종료한다
:q!	##저장하지 않고 강제로 종료
:wq	##저장하고 종료한다.
```