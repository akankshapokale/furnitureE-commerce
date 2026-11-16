import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requirePermission } from '../middleware/staff';
import { requireAuth } from '../middleware/auth';
import cloudinary from '../config/cloudinary';

const router = express.Router();


// Store uploads alongside existing product images in website/public/uploads/
const UPLOAD_DIR = path.join(__dirname, '../../../website/public/uploads');

// Create directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase()
      .slice(0, 40);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${unique}${ext}`);
  },
});

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB// CMS images are buffered for Cloudinary; the legacy disk storage below remains for reference uploads.
const cloudinaryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WebP, and GIF images are allowed.'));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, and GIF images are allowed.'));
    }
  },
});

// Custom reference image upload with strict 5MB limit and JPG, JPEG, PNG, WEBP format
const CUSTOM_IMAGE_ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const CUSTOM_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const customRefUpload = multer({
  storage,
  limits: { fileSize: CUSTOM_IMAGE_MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    if (CUSTOM_IMAGE_ALLOWED_MIME.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WEBP image formats are allowed.'));
    }
  },
});

// POST /api/upload/image — returns { url: '/uploads/filename.ext' } (Admin CMS)
router.post('/image', requirePermission('website-control'), cloudinaryUpload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded.' });
    return;
  }
  try {
    const asset = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'staging-spaces/cms', resource_type: 'image', use_filename: false, unique_filename: true },
        (error, result) => error ? reject(error) : result ? resolve(result) : reject(new Error('Cloudinary returned no image.')),
      );
      stream.end(req.file!.buffer);
    });
    return res.json({ url: asset.secure_url, public_id: asset.public_id, format: asset.format, bytes: asset.bytes, width: asset.width, height: asset.height });
  } catch (error) {
    console.error('Cloudinary CMS image upload failed:', error);
    return res.status(502).json({ message: 'Image upload to Cloudinary failed. Please try again.' });
  }
});

// POST /api/upload/reference-image — authenticated customer upload for custom size reference
router.post(
  '/reference-image',
  requireAuth,
  (req: Request, res: Response, next) => {
    customRefUpload.single('reference_image')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'Reference image size exceeds maximum limit of 5 MB.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message || 'Invalid reference image format.' });
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No reference image file provided.' });
    }
    const url = `/uploads/${req.file.filename}`;
    return res.json({ success: true, url, filename: req.file.filename, size: req.file.size });
  }
);

export default router;
