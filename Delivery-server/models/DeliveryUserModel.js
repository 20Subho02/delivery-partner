import mongoose from "mongoose"

const DeliveryUserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const deliveryUserModel = mongoose.models.user || mongoose.model("DeliveryUser", DeliveryUserSchema)
export default deliveryUserModel;