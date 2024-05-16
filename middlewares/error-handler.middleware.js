export default (err, req, res, next) => {
    console.error(err);

    if (err.isJoi) {
        return res.status(400).json({ status: 400, message: err.details[0].message });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ status: 400, message: err.message });
    }

    return res.status(500).json({ status: 500, message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.' });
};
