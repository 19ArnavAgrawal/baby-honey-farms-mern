import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

export const categoriesData = [
  {
    name: 'Raw Honey',
    slug: 'raw-honey',
    description: 'Cold-extracted, unfiltered honey straight from ethical apiaries.',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Monofloral Reserve',
    slug: 'monofloral-reserve',
    description: 'Single nectar source honeys with distinct floral tasting notes.',
    imageUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Infused & Wellness',
    slug: 'infused-wellness',
    description: 'Handcrafted raw honey infused with medicinal herbs and spices.',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Comb & Specialty',
    slug: 'comb-specialty',
    description: 'Intact raw comb honey with live enzymes, propolis, and beeswax.',
    imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
  },
];

export const productsData = [
  {
    name: 'Himalayan Wildflower Raw Honey',
    slug: 'himalayan-wildflower-raw-honey',
    category: 'Raw Honey',
    tagline: 'High-Altitude Forest Nectar with Deep Herbal Undertones',
    shortDescription: 'Harvested from pristine alpine meadows above 7,000 feet in Himachal Pradesh.',
    description: 'Our Himalayan Wildflower Raw Honey is gathered by native bees foraging on diverse medicinal alpine flora. Cold-extracted by hand to safeguard all beneficial enzymes, phytonutrients, and pollen grains, it offers a layered caramel richness followed by lingering herbal notes.',
    basePrice: 799,
    originalPrice: 999,
    weightVariants: [
      { weight: 250, price: 449, originalPrice: 549, stock: 45 },
      { weight: 500, price: 799, originalPrice: 999, stock: 60 },
      { weight: 1000, price: 1499, originalPrice: 1899, stock: 25 },
    ],
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=80',
    ],
    origin: { region: 'Kullu Valley', state: 'Himachal Pradesh', country: 'India' },
    floralSource: 'Wild Himalayan Flora',
    harvestSeason: 'Spring Harvest',
    flavorProfile: { sweetness: 4, floral: 5, fruity: 3, earthy: 3, richness: 5 },
    flavorNotes: ['Wild thyme', 'Mountain flora', 'Warm caramel', 'Earthy oak'],
    healthBenefits: ['Potent natural antioxidant', 'Soothes throat irritation', 'Enhances vitality & stamina'],
    certifications: ['100% Raw & Cold Extracted', 'Lab Tested Purity Report', 'Zero Antibiotics'],
    stock: 130,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 84,
  },
  {
    name: 'Organic Kashmir White Acacia Honey',
    slug: 'organic-kashmir-white-acacia-honey',
    category: 'Monofloral Reserve',
    tagline: 'Ultra-Clear, Delicate Nectar with Subtle Vanilla Finish',
    shortDescription: 'Sourced from the blooming Robinia pseudoacacia groves of the Kashmir Valley.',
    description: 'Renowned for its crystal-clear golden hue and extraordinarily delicate sweetness, Kashmir Acacia honey remains liquid for a prolonged duration due to its naturally high fructose ratio. Gentle and smooth, it pairs sublimely with fine cheeses, teas, and fresh fruits.',
    basePrice: 949,
    originalPrice: 1199,
    weightVariants: [
      { weight: 250, price: 549, originalPrice: 699, stock: 35 },
      { weight: 500, price: 949, originalPrice: 1199, stock: 50 },
      { weight: 1000, price: 1799, originalPrice: 2299, stock: 18 },
    ],
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
    ],
    origin: { region: 'Pahalgam Valley', state: 'Jammu & Kashmir', country: 'India' },
    floralSource: 'Acacia Blossom (Robinia pseudoacacia)',
    harvestSeason: 'Late Spring',
    flavorProfile: { sweetness: 5, floral: 3, fruity: 4, earthy: 1, richness: 4 },
    flavorNotes: ['Mild vanilla', 'Sweet pear', 'Subtle floral essence'],
    healthBenefits: ['Low glycemic index', 'Gentle on digestive tract', 'Natural energy release'],
    certifications: ['True Source Certified', 'Zero Added Sugars', 'NABL Lab Certified'],
    stock: 103,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    rating: 5.0,
    reviewsCount: 62,
  },
  {
    name: 'Royal Sidr / Berry Blossom Honey',
    slug: 'royal-sidr-berry-blossom-honey',
    category: 'Monofloral Reserve',
    tagline: 'The Legendary Liquid Gold Sourced from Ancient Wild Sidr Trees',
    shortDescription: 'Prized for centuries for its profound medicinal potency and rich butterscotch depth.',
    description: 'Sidr honey is harvested from wild jujube/sidr trees during a strict two-week flowering cycle. Distinctively aromatic with thick viscosity, it is celebrated worldwide for anti-inflammatory qualities and rich antibacterial mineral concentration.',
    basePrice: 1199,
    originalPrice: 1499,
    weightVariants: [
      { weight: 250, price: 699, originalPrice: 849, stock: 25 },
      { weight: 500, price: 1199, originalPrice: 1499, stock: 35 },
      { weight: 1000, price: 2199, originalPrice: 2699, stock: 15 },
    ],
    images: [
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=80',
    ],
    origin: { region: 'Bhiwani & Rohtak Native Groves', state: 'Haryana', country: 'India' },
    floralSource: 'Wild Ziziphus (Sidr / Ber) Blossom',
    harvestSeason: 'Late Autumn Harvest',
    flavorProfile: { sweetness: 4, floral: 4, fruity: 3, earthy: 5, richness: 5 },
    flavorNotes: ['Butterscotch', 'Caramelized fig', 'Warm amber spice'],
    healthBenefits: ['Superior antibacterial properties', 'Accelerates wound healing', 'Strengthens immune defense'],
    certifications: ['Grade-A Ayurvedic Standard', 'Cold Extracted Raw', '100% Unadulterated'],
    stock: 75,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    rating: 4.9,
    reviewsCount: 45,
  },
  {
    name: 'Farm Fresh Mustard Blossom Honey',
    slug: 'farm-fresh-mustard-blossom-honey',
    category: 'Raw Honey',
    tagline: 'Naturally Creamed, Golden Harvest from Rohtak Mustard Fields',
    shortDescription: 'Harvested from our family-run apiary fields in Titoli, Rohtak, Haryana.',
    description: 'Our pride and joy from Titoli, Rohtak! During the crisp North Indian winters, expansive yellow mustard blossoms produce a velvety nectar that naturally granulates into a luscious creamed texture. Perfect as a bread spread or coffee sweetener.',
    basePrice: 599,
    originalPrice: 749,
    weightVariants: [
      { weight: 250, price: 349, originalPrice: 429, stock: 50 },
      { weight: 500, price: 599, originalPrice: 749, stock: 70 },
      { weight: 1000, price: 1099, originalPrice: 1399, stock: 40 },
    ],
    images: [
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
    ],
    origin: { region: 'Titoli, Rohtak', state: 'Haryana', country: 'India' },
    floralSource: 'Brassica campestris (Yellow Mustard Flower)',
    harvestSeason: 'Winter Harvest (Dec - Jan)',
    flavorProfile: { sweetness: 4, floral: 3, fruity: 2, earthy: 4, richness: 4 },
    flavorNotes: ['Mellow honeyed malt', 'Subtle peppery flower', 'Smooth velvety finish'],
    healthBenefits: ['Rich in plant sterols', 'Supports heart health', 'Traditional seasonal cold remedy'],
    certifications: ['Direct From Farm Apiary', 'Unpasteurized & Raw', 'Zero Chemical Residues'],
    stock: 160,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 96,
  },
  {
    name: 'Raw Honeycomb Chunk in Acacia Jar',
    slug: 'raw-honeycomb-chunk-in-acacia-jar',
    category: 'Comb & Specialty',
    tagline: '100% Edible Natural Beeswax Comb Immersed in Pure Liquid Honey',
    shortDescription: 'Experience honey the way nature intended — bite directly into the comb.',
    description: 'Hand-cut straight from the beehive frames, each jar holds an intact section of honeycomb loaded with natural bee pollen, propolis, and royal jelly traces. The chewable beeswax comb releases bursts of fresh raw floral honey with every bite.',
    basePrice: 899,
    originalPrice: 1099,
    weightVariants: [
      { weight: 350, price: 899, originalPrice: 1099, stock: 20 },
      { weight: 650, price: 1499, originalPrice: 1799, stock: 15 },
    ],
    images: [
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
    ],
    origin: { region: 'Northern Foothills Apiary', state: 'Punjab & Haryana', country: 'India' },
    floralSource: 'Mixed Wildflower & Comb Foundation',
    harvestSeason: 'Spring Comb Harvest',
    flavorProfile: { sweetness: 5, floral: 4, fruity: 4, earthy: 3, richness: 5 },
    flavorNotes: ['Floral wax', 'Meadow nectar', 'Fresh hive aroma'],
    healthBenefits: ['Natural propolis & pollen benefits', 'Supports oral & gum hygiene', 'Pure unaltered nutrition'],
    certifications: ['100% Unprocessed Comb', 'Zero Heating or Filtering', 'Food-Grade Glass Packaging'],
    stock: 35,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    rating: 4.9,
    reviewsCount: 31,
  },
  {
    name: 'Holy Tulsi Infused Raw Honey',
    slug: 'holy-tulsi-infused-raw-honey',
    category: 'Infused & Wellness',
    tagline: 'Potent Ayurvedic Elixir with Krishna & Rama Tulsi Leaves',
    shortDescription: 'Slow-infused at room temperature with sacred Holy Basil leaves.',
    description: 'We slow-steep organic Krishna and Rama Tulsi leaves into raw wildflower honey for four weeks. This cold-infusion process extracts essential therapeutic adaptogens without destroying honey’s heat-sensitive enzymes.',
    basePrice: 649,
    originalPrice: 799,
    weightVariants: [
      { weight: 250, price: 389, originalPrice: 479, stock: 30 },
      { weight: 500, price: 649, originalPrice: 799, stock: 45 },
      { weight: 1000, price: 1199, originalPrice: 1499, stock: 20 },
    ],
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
    ],
    origin: { region: 'Titoli Botanical Apiary', state: 'Haryana', country: 'India' },
    floralSource: 'Wildflower & Ocimum sanctum (Tulsi)',
    harvestSeason: 'Autumn Infusion',
    flavorProfile: { sweetness: 4, floral: 4, fruity: 2, earthy: 4, richness: 4 },
    flavorNotes: ['Spiced clove', 'Herbaceous basil', 'Cooling mint touch'],
    healthBenefits: ['Adaptogenic stress reliever', 'Soothes respiratory tract', 'Natural respiratory cleanser'],
    certifications: ['Ayurvedic Formulation', 'Cold Infused Raw', 'Purity Verified'],
    stock: 95,
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 53,
  },
];

export async function seedData() {
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    console.log(`[SeedData] Products already exist (${existingCount}). Skipping initial insert.`);
    return;
  }

  await Category.deleteMany({});
  await Category.insertMany(categoriesData);

  await Product.deleteMany({});
  await Product.insertMany(productsData);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@babyhoneyfarms.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const admin = new User({
      name: 'Farm Master Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    await admin.save();
    console.log(`[SeedData] Admin user created for: ${adminEmail}`);
  }
}
