import * as mongoose from 'mongoose';

interface IPresent extends mongoose.Document {
    sender: string;
    recipient: string;
    resourse: string;
    resVal: number;
}

const presentSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    resourse: String,
    resVal: Number
})

const Present = mongoose.model<IPresent>('Present', presentSchema)

export = Present