import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IMessage {
    senderId: mongoose.Types.ObjectId;
    message: string;
    timestamp: Date;
}

export interface IChat extends Document {
    orderId: mongoose.Types.ObjectId;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatSchema = new Schema<IChat>(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true,
        },
        messages: [MessageSchema],
    },
    {
        timestamps: true,
    }
);

export default models.Chat || model<IChat>('Chat', ChatSchema);