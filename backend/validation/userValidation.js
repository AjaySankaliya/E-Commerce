const joi=require('joi')

const registerValidation=(req,res,next)=>{
    const schema=joi.object({
        firstName:joi.string().min(3).max(20).required(),
        lastName:joi.string().min(3).max(20).required(),
        email:joi.string().email().max(100).required(),
        password:joi.string().min(6).max(10).required()
    });
    const {error}=schema.validate(req.body)
    if(error)
    {
        return res.status(400).json({
            success:false,
            message:"Bad Request",
            err:error
        })
    }
    next()
}

module.exports={registerValidation}