const mongoose=require('mongoose')

const MongoUrl=process.env.MONGO_URL

const connectDB=async()=>{
        await mongoose.connect(MongoUrl)
        .then(()=>console.log("Database connected successfully"))
        .catch((err)=>console.log("Database connection failed",err))
}

module.exports=connectDB