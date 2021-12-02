import * as mongoose from 'mongoose';
import IProperty from "../interfaces/IProperty";
import IResourse from "../interfaces/IResourse";


interface IPlayerModel extends mongoose.Document{
    props: IProperty[];
    resourses: IResourse[];
    outPresCnt: number;
}

const propertySchema = new mongoose.Schema({
    propName: String,
    propValue: Number
})

const resoursesSchema = new mongoose.Schema({
    resName: String,
    resValue: Number
})

const playerSchema = new mongoose.Schema({
    props: [propertySchema],
    resourses: [resoursesSchema],
    outPresCnt: Number
})

const Player = mongoose.model<IPlayerModel>("Player", playerSchema)

export = Player