const router = require('express').Router();
const { Product } = require('../models');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    
    if (price < 0 > 10000000 || quantity < 0 > 100) {
      return res.status(400).json({ message: 'cannot work ' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      image: req.file?.path,
      userId: req.user.id
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ include: 'User' });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { name, description, price, quantity } = req.body;

    
    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Price must not be less than 0' });
    }
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ message: 'Quantity must not be less than 0' });
    }

    if (req.file && product.image) {
      fs.unlink(path.resolve(product.image), (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      price: price ?? product.price,
      quantity: quantity ?? product.quantity,
      image: req.file ? req.file.path : product.image,
    });

    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    if (product.image) {
      fs.unlink(path.resolve(product.image), (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
