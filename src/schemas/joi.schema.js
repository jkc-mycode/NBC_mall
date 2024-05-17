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
