import express from 'express';
import upload from '../utils/upload.js';
import { uploadImage, getImage, downloadImage } from '../controller/image-controller.js';

const router = express.Router();


router.post('/upload', upload.single('file'), uploadImage);
router.get('/file/:fileId', getImage); // Use a different controller for rendering the download page
router.get('/file/download/:fileId', downloadImage); // Keep the existing controller for handling the download

export default router;