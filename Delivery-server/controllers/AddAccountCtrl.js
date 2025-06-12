import addAccountModel from '../models/AddAccountModel.js';

const addAccount = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dob,
      gender,
      state,
      dlNumber,
      idProofType
    } = req.body;

    
    const dlPhotoUrl = req.files?.dlPhoto?.[0]?.filename || null;
    const customerPhotoUrl = req.files?.customerPhoto?.[0]?.filename || null;
    const idProofPhotoUrl = req.files?.idProofPhoto?.[0]?.filename || null;

    
    if (!dob || !dlPhotoUrl || !customerPhotoUrl || !idProofPhotoUrl) {
      return res.status(400).json({
        success: false,
        message: 'All required fields and files must be provided',
      });
    }

    const newAccount = new addAccountModel({
      fullName,
      phone,
      dob,
      gender,
      state,
      dlNumber,
      idProofType,
      dlPhotoUrl,
      customerPhotoUrl,
      idProofPhotoUrl
    });

    await newAccount.save();

    res.status(200).json({
      success: true,
      message: 'Account added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while adding account'
    });
  }
};

const getAccountDetails = async(req,res) =>{
    try {
      const userId = req.body.id;
    const account = await addAccountModel.findOne({ userId });
    if (!account) {
      return res.status(404).send({
        success: false,
        message: 'Account not found',
      });
    }

    res.status(200).send({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).send({
      success: false,
      message: 'Server error',
    });
  }
}

export { addAccount, getAccountDetails };
