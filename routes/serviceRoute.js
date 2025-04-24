const express = require('express');
const multer = require('multer');
const Service = require('../models/Service');
const { deleteFile } = require('../utils/fileUtils');
const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});

// Helper function to check featured service count
const canSetFeatured = async () => {
  const featuredCount = await Service.countDocuments({ isFeatured: true });
  return featuredCount < 4; // Allow up to 4 featured services
};

// Create a New Service
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, isFeatured } = req.body;

    // Validate required fields
    if (!title || !description || !req.file) {
      return res.status(400).json({ message: 'All fields are required, including an image.' });
    }

    if (isFeatured === 'true' || isFeatured === true) {
      const canFeature = await canSetFeatured();
      if (!canFeature) {
        return res.status(400).json({ message: 'Only 4 services can be featured at a time.' });
      }
    }

    const service = new Service({
      title,
      description,
      image: `/uploads/${req.file.filename}`,
      isFeatured: Boolean(isFeatured),
    });

    const savedService = await service.save();
    res.status(201).json({
      message: 'Service created successfully!',
      service: savedService,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// Update an Existing Service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isFeatured } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Handle featured service logic
    if (isFeatured === 'true' || isFeatured === true) {
      if (!service.isFeatured) {
        const canFeature = await canSetFeatured();
        if (!canFeature) {
          return res.status(400).json({ message: 'Only 4 services can be featured at a time.' });
        }
      }
    } else if (isFeatured === 'false' || isFeatured === false) {
      service.isFeatured = false;
    }

    // Delete old image if new image uploaded
    if (req.file && service.image) {
      // Normalize image path for deletion
      const imagePath = service.image.startsWith('/uploads/') ? service.image.substring(1) : service.image;
      console.log(`Deleting old image file at path: ${imagePath}`);
      deleteFile(imagePath);
      service.image = `/uploads/${req.file.filename}`;
    }

    // Update fields if provided
    if (title) service.title = title;
    if (description) service.description = description;
    if (isFeatured !== undefined) service.isFeatured = Boolean(isFeatured);

    const updatedService = await service.save();
    res.status(200).json({
      message: 'Service updated successfully!',
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete a Service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete image file
    if (service.image) {
      deleteFile(service.image);
    }

    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

// Get All Services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get Featured Services
router.get('/featured', async (req, res) => {
  try {
    const services = await Service.find({ isFeatured: true }).limit(4);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured services', error: error.message });
  }
});

module.exports = router;
