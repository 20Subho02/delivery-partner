import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1]
    jwt.verify(token,process.env.JWT_SECRET ,(err, decode) =>{
      if (err) {
        return res.status(200).send({
          message:'Auth failed',
          success:false
        })
      } else {
        req.body.userId = decode.id
        next()
      }
    })
}catch (error){
    console.log(error)
    res.status(401).send({
      message:'Auth fail',
      success:false
    })
}
}
export default authMiddleware;
