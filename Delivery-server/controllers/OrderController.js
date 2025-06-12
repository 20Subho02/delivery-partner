import OrderModel from "../models/OrderModel.js"

const getOrdersController = async(req,res)=>{
    try {
        const  orders = await OrderModel.find({})
        res.json({
            success:true,
            data:orders
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Error fetching Data'
        })
    }
}

export {getOrdersController}