import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile :{
            type : String,  //cloudnary Url
            required : true,
        },
        thumbnail: {
            type : String,   //Cloudnary url
            required :true,
        },
        title : {
            type : String,
            required : true
        },
        description :{
           type: String,
           required : true 
        },
        views : {
            type : Number,
            default : 0
        },
        isPublished :{
            type : Boolean,
            default: true
        },
        owner :{
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    },
    {
        timestamps : true
    }
)


videoSchema.plugin(mongooseAggregatePaginate)  //this help us write a aggregation pipeline for mongoDB help me to write mongo DB Queries


export const Video = mongoose.model("Video" , videoSchema)