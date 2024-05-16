export default (err, req, res, next) => {
    console.error(err);

    if (err.isJoi) {
        return res.status(400).json({ errorMessage: err.details[0].message });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ errorMessage: err.message });
    }

    return res.status(500).json({ errorMessage: '서버에서 에러가 발생했습니다.' });
};
