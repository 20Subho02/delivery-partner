import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import deliveryUserModel from "../models/DeliveryUserModel.js";

// Token Create
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.json({ success: false, message: "All fields are required." });
        }

        const exists = await deliveryUserModel.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.json({
                success: false,
                message: "User already exists."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new deliveryUserModel({
            username,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.json({
            success: false,
            message: "Something went wrong..."
        });
    }
};

//Login
const loginUser = async(req,res) =>{
    const {email,password} = req.body;

    try {
        const user = await deliveryUserModel.findOne({email})

        if (!user) {
            return res.json({
                success:false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.json({
                success:false,
                message: "Invalid userId or password"
            })
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:"Error while login"
        })
    }
}

//Auth
const authControl = async (req, res) => {
  try {
    const user = await deliveryUserModel.findOne({_id:req.body.userId});
    // user.password = undefined;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Auth Control Error:", error.message);
    res.status(500).json({ success: false, message: 'Error fetching user data' });
  }
};


export { registerUser, loginUser,authControl };
