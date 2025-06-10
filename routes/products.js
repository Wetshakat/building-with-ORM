const router = require('express').Router();
const { Product } = require('../models');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPG, JPEG, and PNG files are allowed.'));
};

const upload = multer({ storage, fileFilter });



router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    if (!name || !description || price == null || quantity == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

   
    if (price < 0 || quantity < 0) {
      return res.status(400).json({ message: 'Price and quantity cannot be negative' });
    }

    const image = req.file ? req.file.path : null;

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      image,
      userId: req.user.id
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { name, description, price, quantity } = req.body;

    if (price < 0 || quantity < 0) {
      return res.status(400).json({ message: 'Price and quantity must not be negative' });
    }

   
    if (req.file && product.image) {
      fs.unlink(product.image, err => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    const updatedProduct = await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      price: price ?? product.price,
      quantity: quantity ?? product.quantity,
      image: req.file ? req.file.path : product.image
    });

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

   
    if (product.image) {
      fs.unlink(product.image, err => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
