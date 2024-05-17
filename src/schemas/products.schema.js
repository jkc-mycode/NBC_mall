import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/product.constant.js';

const productsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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
            select: false,
        },
        status: {
            type: String,
            required: false,
            enum: Object.values(PRODUCT_STATUS),
            default: PRODUCT_STATUS.FOR_SALE,
        },
        createdAt: {
            type: Date,
            required: false,
        },
        updatedAt: {
            type: Date,
            required: false,
        },
    },
    { timestamps: true, toJSON: { virtuals: true } },
);

export default mongoose.model('Products', productsSchema);
