import mongoose from 'mongoose';

const weightVariantSchema = new mongoose.Schema(
  {
    weight: {
      type: Number, // in grams, e.g. 250, 500, 1000
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      default: 20,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    weightVariants: {
      type: [weightVariantSchema],
      default: [
        { weight: 250, price: 499, originalPrice: 599, stock: 35 },
        { weight: 500, price: 899, originalPrice: 1099, stock: 50 },
        { weight: 1000, price: 1699, originalPrice: 1999, stock: 25 },
      ],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: [(val) => val.length > 0, 'Must have at least one image'],
    },
    origin: {
      region: { type: String, default: 'Titoli, Rohtak' },
      state: { type: String, default: 'Haryana' },
      country: { type: String, default: 'India' },
    },
    floralSource: {
      type: String,
      default: 'Wild Flora',
    },
    harvestSeason: {
      type: String,
      default: 'Spring / Autumn',
    },
    flavorProfile: {
      sweetness: { type: Number, default: 4, min: 1, max: 5 },
      floral: { type: Number, default: 4, min: 1, max: 5 },
      fruity: { type: Number, default: 3, min: 1, max: 5 },
      earthy: { type: Number, default: 2, min: 1, max: 5 },
      richness: { type: Number, default: 5, min: 1, max: 5 },
    },
    flavorNotes: {
      type: [String],
      default: [],
    },
    healthBenefits: {
      type: [String],
      default: ['Boosts Immunity', 'Natural Antioxidant', 'Soothes Throat'],
    },
    certifications: {
      type: [String],
      default: ['100% Raw & Unprocessed', 'Lab Tested Purity', 'Zero Adulteration'],
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 28,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
