import { Product } from '../models/Product.js';

// @desc    Get all products with filtering, search, and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      featured,
      inStock,
      page = 1,
      limit = 50,
    } = req.query;

    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { floralSource: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { basePrice: 1 };
    else if (sort === 'price-desc') sortOption = { basePrice: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'bestseller') sortOption = { isBestseller: -1, rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      shortDescription,
      basePrice,
      originalPrice,
      weightVariants,
      images,
      origin,
      floralSource,
      harvestSeason,
      flavorProfile,
      flavorNotes,
      healthBenefits,
      certifications,
      stock,
      isFeatured,
      isBestseller,
    } = req.body;

    if (!name || !category || !description || !basePrice || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, description, basePrice, and at least one image are required',
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug exists, append random if needed
    let finalSlug = slug;
    const existing = await Product.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await Product.create({
      name,
      slug: finalSlug,
      category,
      description,
      shortDescription: shortDescription || description.slice(0, 140) + '...',
      basePrice: Number(basePrice),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      weightVariants: weightVariants && weightVariants.length > 0 ? weightVariants : [
        { weight: 250, price: Math.round(Number(basePrice) * 0.55), stock: 25 },
        { weight: 500, price: Number(basePrice), stock: 40 },
        { weight: 1000, price: Math.round(Number(basePrice) * 1.85), stock: 20 },
      ],
      images,
      origin: origin || { region: 'Titoli, Rohtak', state: 'Haryana', country: 'India' },
      floralSource: floralSource || 'Raw Forest Blossom',
      harvestSeason: harvestSeason || 'Seasonal Autumn Harvest',
      flavorProfile: flavorProfile || { sweetness: 4, floral: 4, fruity: 3, earthy: 2, richness: 5 },
      flavorNotes: flavorNotes || [],
      healthBenefits: healthBenefits || ['Antioxidant Rich', 'Natural Energy', 'Immune Support'],
      certifications: certifications || ['100% Raw Purity Tested', 'Cold Extracted'],
      stock: stock ? Number(stock) : 50,
      inStock: stock ? Number(stock) > 0 : true,
      isFeatured: !!isFeatured,
      isBestseller: !!isBestseller,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update fields
    const updates = req.body;
    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (updates.stock !== undefined) {
      updates.inStock = Number(updates.stock) > 0;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(id);

    res.json({ success: true, message: 'Product successfully removed from database' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
