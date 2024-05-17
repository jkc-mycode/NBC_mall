import mongoose from 'mongoose';
import { MONGO_URI, MONGO_NAME } from '../constants/env.constant.js';

const connect = () => {
    mongoose
        .connect(MONGO_URI, { dbName: MONGO_NAME })
        .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
        .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
    console.error('MongoDB 연결 에러', err);
});

export default connect;
