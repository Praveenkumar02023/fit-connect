import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../utils/cloudinary'

const storage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : "public",
        allowed_formats: ['jpg', 'jpeg', 'png',"avif"],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    } as any
});

const upload = multer({ storage })

export default upload