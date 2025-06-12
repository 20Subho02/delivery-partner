import express from 'express';
import { addAccount, getAccountDetails } from '../controllers/AddAccountCtrl.js';
import authMiddleWare from '../middleware/auth.js'
import multer from 'multer';

const addAccountRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Accept multiple files with different field names
addAccountRouter.post(
  '/add-account',
  upload.fields([
    { name: 'dlPhoto', maxCount: 1 },
    { name: 'customerPhoto', maxCount: 1 },
    { name: 'idProofPhoto', maxCount: 1 }
  ]),
  addAccount
);

addAccountRouter.post('/getAccountDetails',authMiddleWare,getAccountDetails);

export default addAccountRouter;
