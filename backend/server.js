const express=require('express')
const app=express()
require('dotenv').config()
const db=require('./config/db')
const userRouter=require('./routers/userRouter')

db()

app.use(express.json())
app.use('/auth',userRouter)

const PORT=process.env.PORT 
app.listen(PORT,()=>{
    console.log(`server have running on port ${PORT}`);
})