import mongoose from 'mongoose'

const addAccountSchema = new mongoose.Schema({
  userId:{
    type:String
  },
    fullName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true   
    },
    gender:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    dlNumber:{
        type:String,
        required:true
    },
      dlPhotoUrl: {
    type: String,
    required: true,
  },
  customerPhotoUrl: {
    type: String,
    required: true,
  },
  idProofType: {
    type: String,
    enum: ['aadhar', 'voter', 'pan'],
    required: true,
  },
  idProofPhotoUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status:{
        type:String,
        default: 'pending'
    }
}, {timestamps: true})

const addAccountModel = mongoose.model("Delivery-Partner-account",addAccountSchema)
export default addAccountModel;