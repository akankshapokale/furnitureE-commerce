
export interface Subcategory {
  id: string;
  name: string;
  path: string;
  group?: string; // Optional grouping e.g. "Modular Furniture" vs "Metal Furniture"
  section?: string; // Optional section within a group, used by the category picker.
  includedSubcategoryIds?: string[];
  children?: Subcategory[];
}

export const groupSubcategories = (subcategories: Subcategory[]) => {
  const groups = new Map<string, Subcategory[]>();
  subcategories.forEach((subcategory) => {
    const groupName = subcategory.group?.trim() || "Browse";
    groups.set(groupName, [...(groups.get(groupName) || []), subcategory]);
  });
  return Array.from(groups, ([name, items]) => ({ name, items }));
};

export interface CategoryHeading {
  id: string;
  name: string;
  path: string;
  includedSubcategoryIds?: string[];
}

export const getCategoryHeadings = (category: { id: string; name: string; subcategories?: Subcategory[] }): CategoryHeading[] => {
  switch (category.id) {
    case 'office-furniture':
      return [
        {
          id: 'desk-table',
          name: 'Desk & Table',
          path: '/category/office-furniture?sub=desk-table',
          includedSubcategoryIds: ['boss-table', 'podium-table', 'reception-table', 'table-employee'],
        },
        {
          id: 'storage',
          name: 'Storage',
          path: '/category/office-furniture?sub=storage',
          includedSubcategoryIds: ['wooden-pedestal', 'full-height-storage', 'low-height-storage', 'side-runner'],
        },
        {
          id: 'workstation-group',
          name: 'Workstation',
          path: '/category/office-furniture?sub=workstation-group',
          includedSubcategoryIds: ['workstation', 'conference-table'],
        },
        {
          id: 'office-metal-furniture',
          name: 'Metal Furniture',
          path: '/category/office-furniture?sub=office-metal-furniture',
          includedSubcategoryIds: ['metal-table', 'metal-office-table', 'metal-pedestal', 'conference-metal-table'],
        },
      ];

    case 'cupboards-almirahs':
      return [
        {
          id: 'cupboards-almirahs-group',
          name: 'Cupboards & Almirahs',
          path: '/category/cupboards-almirahs?sub=cupboards-almirahs-group',
          includedSubcategoryIds: ['storewell', 'almirah', 'unit-cupboard', 'three-door-steel-storage', 'corporate-storage'],
        },
        {
          id: 'lockers-group',
          name: 'Lockers',
          path: '/category/cupboards-almirahs?sub=lockers-group',
          includedSubcategoryIds: ['industrial-locker'],
        },
        {
          id: 'filing-library-group',
          name: 'Filing & Library Storage',
          path: '/category/cupboards-almirahs?sub=filing-library-group',
          includedSubcategoryIds: ['filing-cabinet', 'bookcase', 'library-cupboard'],
        },
      ];

    case 'seating-solutions':
      return [
        {
          id: 'boss-chair-group',
          name: 'Executive & Boss Chairs',
          path: '/category/seating-solutions?sub=boss-chair-group',
          includedSubcategoryIds: ['boss-chair', 'premium-chair', 'executive-chair'],
        },
        {
          id: 'visitor-training-chairs-group',
          name: 'Visitor & Training Chairs',
          path: '/category/seating-solutions?sub=visitor-training-chairs-group',
          includedSubcategoryIds: ['visitor-chair', 'training-chair'],
        },
        {
          id: 'office-sofas-group',
          name: 'Office Sofas',
          path: '/category/seating-solutions?sub=office-sofas-group',
          includedSubcategoryIds: ['office-sofa'],
        },
      ];

    case 'outdoor-furniture':
      return [
        {
          id: 'outdoor-planters-group',
          name: 'Outdoor Planters & Stands',
          path: '/category/outdoor-furniture?sub=outdoor-planters-group',
          includedSubcategoryIds: ['metal-planter', 'planter-stand', 'planter-trolley-wheels'],
        },
        {
          id: 'outdoor-seating-tables-group',
          name: 'Outdoor Seating & Tables',
          path: '/category/outdoor-furniture?sub=outdoor-seating-tables-group',
          includedSubcategoryIds: ['garden-chair', 'metal-sofa', 'metal-table'],
        },
      ];

    case 'bunk-beds':
      return [
        {
          id: 'commercial-bunk-bed',
          name: 'Commercial Bunk Bed',
          path: '/category/bunk-beds?sub=commercial-bunk-bed',
          includedSubcategoryIds: ['commercial-bunk-bed'],
        },
        {
          id: 'hostel',
          name: 'Hostel Bunk Bed',
          path: '/category/bunk-beds?sub=hostel',
          includedSubcategoryIds: ['hostel'],
        },
        {
          id: 'kids',
          name: 'Residential Bunk Bed',
          path: '/category/bunk-beds?sub=kids',
          includedSubcategoryIds: ['kids'],
        },
      ];

    case 'home-furniture':
      return [
        {
          id: 'living-room-group',
          name: 'Living Room & Sofas',
          path: '/category/home-furniture?sub=living-room-group',
          includedSubcategoryIds: ['kitchen-unit', 'sofas', 'tv-unit'],
        },
        {
          id: 'dining-study-group',
          name: 'Dining & Study Tables',
          path: '/category/home-furniture?sub=dining-study-group',
          includedSubcategoryIds: ['bar-unit', 'foldable-table', 'side-table', 'study-table'],
        },
      ];

    default:
      return ((category.subcategories) || []).map((sub) => ({
        id: sub.id,
        name: sub.name,
        path: sub.path,
        includedSubcategoryIds: [sub.id, ...(sub.includedSubcategoryIds || [])],
      }));
  }
};


export interface ColorVariant {
  key: string;
  name: string;
  colorCode: string;
  image?: string;
  badge?: string;
}

export interface VariantChoice {
  label: string;
  priceDiff?: number;
  isDefault?: boolean;
}

export interface ProductVariantOption {
  type: string;
  name: string;
  options: VariantChoice[];
}

export interface CategoryProduct {
  id: number;
  name: string;
  category: string;
  subcategoryId: string;
  subcategoryName: string;
  cmsSubcategoryName?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  cmsDimensionImage?: string;
  cmsHoverImage?: string;
  rating?: number;
  ratingCount?: number;
  badge?: string;
  description: string;
  specifications?: { label: string; value: string }[];
  colors?: ColorVariant[];
  variants?: ProductVariantOption[];
  sizes?: { label: string; price: number; oldPrice?: number }[];
}

export const STANDARD_STEEL_COLORS: ColorVariant[] = [
  { key: "white", name: "Pearl White", colorCode: "#f7f7f3", badge: "Classic" },
  { key: "black", name: "Matte Black", colorCode: "#202124", badge: "Modern" },
  { key: "grey", name: "Steel Grey", colorCode: "#7e8791", badge: "Standard" },
  { key: "ivory", name: "Ivory Cream", colorCode: "#f1e4c7", badge: "Dual Tone" },
];

// These finishes have matching cupboard images in /public/images-webp.
export const CUPBOARD_STEEL_COLORS: ColorVariant[] = [
  { key: "white", name: "Pearl White", colorCode: "#f7f7f3", badge: "Classic" },
  { key: "grey", name: "Steel Grey", colorCode: "#7e8791", badge: "Standard" },
  { key: "charcoal", name: "Charcoal", colorCode: "#45484d", badge: "Contemporary" },
  { key: "black", name: "Matte Black", colorCode: "#202124", badge: "Modern" },
];


export const getProductColorImage = (
  baseImage: string,
  colorKey?: string
): string => {
  if (!baseImage || !colorKey) {
    return baseImage;
  }

  // Use an explicitly configured color image when available.
  const raw = baseImage.split("?")[0];

  if (!raw.includes("/images-webp/")) {
    return baseImage;
  }

  const prefix = raw.replace(/\.webp$/i, "");
  const cleanPrefix = prefix.replace(
    /_(grey|white|black|ivory|blue|olive|maroon|charcoal)$/i,
    ""
  );

  return `${cleanPrefix}_${colorKey}.webp`;
};


export const getSubcategoryVariants = (subcategoryId: string): ProductVariantOption[] => {
  switch (subcategoryId.toLowerCase()) {
    case "table-employee":
    case "metal-office-table":
    case "metal-table":
    case "boss-table":
    case "outdoor-metal-table":
      return [
        {
          type: "size",
          name: "Table Size",
          options: [
            { label: "3×2 ft", priceDiff: 0, isDefault: true },
            { label: "5×2 ft", priceDiff: 3000 },
          ],
        },
        {
          type: "finish",
          name: "Top & Frame Finish",
          options: [
            { label: "Warm Teak / Black Frame", priceDiff: 0, isDefault: true },
            { label: "Classic Walnut / Grey Frame", priceDiff: 400 },
            { label: "Natural Oak / White Frame", priceDiff: 600 },
          ],
        },
      ];
    case "storewell":
    case "metal-storewell":
      return [
        {
          type: "size",
          name: "Size / Height",
          options: [
            { label: "Standard 6.5 ft (78\" H x 36\" W x 19\" D)", priceDiff: 0, isDefault: true },
            { label: "Compact 5.5 ft (66\" H x 33\" W x 18\" D)", priceDiff: -1500 },
            { label: "Jumbo Mega (78\" H x 42\" W x 21\" D)", priceDiff: 2500 },
          ],
        },
        {
          type: "config",
          name: "Internal Configuration",
          options: [
            { label: "With Inbuilt Safe Locker & Drawers", priceDiff: 0, isDefault: true },
            { label: "Full Shelves Only (No Locker)", priceDiff: -1000 },
            { label: "Wardrobe Hanging Rod + Safe Locker", priceDiff: 800 },
          ],
        },
      ];
    case "industrial-locker":
      return [
        {
          type: "doors",
          name: "Locker Compartments",
          options: [
            { label: "6-Door Standard Staff Unit", priceDiff: 0, isDefault: true },
            { label: "4-Door Large Compartments", priceDiff: -1200 },
            { label: "9-Door Multi-Staff Unit", priceDiff: 2800 },
            { label: "12-Door Factory/Gym Unit", priceDiff: 4500 },
          ],
        },
        {
          type: "lock",
          name: "Locking Mechanism",
          options: [
            { label: "Individual Key Locks (2 Keys each)", priceDiff: 0, isDefault: true },
            { label: "Padlock Hasp Flaps (Use own lock)", priceDiff: -500 },
            { label: "Master Key System Support", priceDiff: 1000 },
          ],
        },
      ];
    case "almirah":
      return [
        {
          type: "mirror",
          name: "Mirror & Door Style",
          options: [
            { label: "Full-Length Dressing Mirror", priceDiff: 0, isDefault: true },
            { label: "Solid Steel Classic Door", priceDiff: -1200 },
            { label: "Dual Full Mirrors (Both Doors)", priceDiff: 1600 },
          ],
        },
        {
          type: "locker",
          name: "Internal Vault",
          options: [
            { label: "With Secret Safe Locker & Bangle Rod", priceDiff: 0, isDefault: true },
            { label: "Standard Multi-Shelf Storage", priceDiff: -800 },
          ],
        },
      ];
    case "unit-cupboard":
      return [
        {
          type: "height",
          name: "Cabinet Height",
          options: [
            { label: "Medium 48\" H (3 Shelves)", priceDiff: 0, isDefault: true },
            { label: "Compact 36\" H (2 Shelves)", priceDiff: -1200 },
            { label: "Tall 60\" H (4 Shelves)", priceDiff: 1600 },
          ],
        },
      ];
    case "filing-cabinet":
      return [
        {
          type: "drawers",
          name: "Filing Drawer Setup",
          options: [
            { label: "4 Drawers Vertical (Legal/A4)", priceDiff: 0, isDefault: true },
            { label: "3 Drawers Vertical", priceDiff: -1500 },
            { label: "2 Drawers Desk Height", priceDiff: -2500 },
          ],
        },
      ];
    case "bookcase":
      return [
        {
          type: "glass",
          name: "Front Protection",
          options: [
            { label: "Toughened Transparent Glass Hinged", priceDiff: 0, isDefault: true },
            { label: "Sliding Glass Track Doors", priceDiff: 1200 },
            { label: "Open Steel Bookshelf (No Glass)", priceDiff: -1500 },
          ],
        },
      ];
    case "library-cupboard":
      return [
        {
          type: "doors",
          name: "Library Door Style",
          options: [
            { label: "Double Glass Display Doors", priceDiff: 0, isDefault: true },
            { label: "Perforated Mesh Air-Vent Doors", priceDiff: 1000 },
            { label: "Heavy Archival Solid Steel", priceDiff: -500 },
          ],
        },
        {
          type: "capacity",
          name: "Shelf Weight Rating",
          options: [
            { label: "70 kg/Shelf Standard", priceDiff: 0, isDefault: true },
            { label: "100 kg/Shelf Reinforced", priceDiff: 1800 },
          ],
        },
      ];
    default:
      return [
        {
          type: "finish",
          name: "Coating Type",
          options: [
            { label: "Anti-Rust Epoxy Powder Coated", priceDiff: 0, isDefault: true },
            { label: "Heavy Industrial Matte Finish", priceDiff: 500 },
          ],
        },
      ];
  }
};

export interface CategoryItem {
  id: string;
  name: string;
  badge?: string;
  description: string;
  featured: {
    title: string;
    description: string;
    image: string;
  };
  subcategories: Subcategory[];
  products: CategoryProduct[];
}

export const categoriesData: CategoryItem[] = [
  // 1. Office Furniture
  {
    id: "office-furniture",
    name: "Office Furniture",
    badge: "Popular",
    description:
      "Modern modular workstations, executive boss desks, reception counters, and ergonomic office storage.",
    featured: {
      title: "Modular & Executive Workspaces",
      description: "Employee tables, boss desks, workstations, and metal storage solutions.",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&h=400&q=80",
    },
    subcategories: [
      // Main Headings for navigation
      { id: "desk-table", name: "Desk & Table", path: "/category/office-furniture?sub=desk-table", includedSubcategoryIds: ["boss-table", "podium-table", "reception-table", "table-employee"] },
      { id: "storage", name: "Storage", path: "/category/office-furniture?sub=storage", includedSubcategoryIds: ["wooden-pedestal", "full-height-storage", "low-height-storage", "side-runner"] },
      { id: "workstation-group", name: "Workstation", path: "/category/office-furniture?sub=workstation-group", includedSubcategoryIds: ["workstation", "conference-table"] },
      { id: "office-metal-furniture", name: "Metal Furniture", path: "/category/office-furniture?sub=office-metal-furniture", includedSubcategoryIds: ["metal-table", "metal-office-table", "metal-pedestal", "conference-metal-table"] },

      // Modular Furniture
      { id: "boss-table", name: "Executive Table", path: "/category/office-furniture?sub=boss-table", group: "Modular Furniture", section: "Desk & Table" },
      { id: "podium-table", name: "Podium Table", path: "/category/office-furniture?sub=podium-table", group: "Modular Furniture", section: "Desk & Table" },
      { id: "reception-table", name: "Reception Desk", path: "/category/office-furniture?sub=reception-table", group: "Modular Furniture", section: "Desk & Table" },
      { id: "table-employee", name: "Employee Desk", path: "/category/office-furniture?sub=table-employee", group: "Modular Furniture", section: "Desk & Table" },
      {
        id: "wooden-pedestal",
        name: "Pedestal",
        path: "/category/office-furniture?sub=wooden-pedestal",
        group: "Modular Furniture",
        section: "Storage",
      },
      { id: "full-height-storage", name: "File Cabinet", path: "/category/office-furniture?sub=full-height-storage", group: "Modular Furniture", section: "Storage" },
      { id: "side-runner", name: "Side Runner", path: "/category/office-furniture?sub=side-runner", group: "Modular Furniture", section: "Storage" },
      { id: "workstation", name: "Modular Workstation", path: "/category/office-furniture?sub=workstation", group: "Modular Furniture", section: "Workstation" },
      { id: "conference-table", name: "Conference & Meeting Tables", path: "/category/office-furniture?sub=conference-table", group: "Modular Furniture", section: "Workstation" },
      // Metal Furniture (Clicking Metal Furniture redirects to Cupboards & Almirahs)
    
      { id: "metal-table", name: "Metal Executive Table", path: "/category/office-furniture?sub=metal-table", group: "Metal Furniture" },
      { id: "metal-office-table", name: "Metal Office Table", path: "/category/office-furniture?sub=metal-office-table", group: "Metal Furniture" },
      { id: "metal-pedestal", name: "Metal Pedestal", path: "/category/office-furniture?sub=metal-pedestal", group: "Metal Furniture" },
      { id: "conference-metal-table", name: "Conference Metal Table", path: "/category/office-furniture?sub=conference-metal-table", group: "Metal Furniture" },
    ],
    
products: [
  {
    id: 101,
    name: "Employee Work Desk",
    category: "Office Furniture",
    subcategoryId: "table-employee",
    subcategoryName: "Employee Desk",
    price: 5499,
    oldPrice: 7200,
    discount: 24,
    image: "/images-webp/employeetable1.webp",
    images: ["/images-webp/employeetable1.webp"],
    rating: 4.8,
    ratingCount: 28,
    badge: "Bestseller",
    description: "A professional employee work table designed for daily office tasks, offering a clean and organized workspace.",
  },
  {
    id: 111,
    name: "Compact Employee Office Desk",
    category: "Office Furniture",
    subcategoryId: "table-employee",
    subcategoryName: "Employee Desk",
    price: 5499,
    image: "/images-webp/employeetable2.webp",
    images: ["/images-webp/employeetable2.webp"],
    rating: 4.8,
    ratingCount: 28,
    description: "A compact office desk ideal for individual workstations and space-efficient employee seating arrangements.",
  },
  
{
  id: 112,
  name: "Classic Wooden Employee Desk",
  category: "Office Furniture",
  subcategoryId: "table-employee",
  subcategoryName: "Employee Table",
  price: 5499,
  image: "/images-webp/employeetable3.webp",
  images: ["/images-webp/employeetable3.webp"],
  rating: 4.8,
  ratingCount: 28,
  description:
    "A classic wooden employee table with a spacious work surface, side storage shelves, and drawers for keeping office essentials organized.",
},
  {
    id: 113,
    name: "Corporate Employee Desk",
    category: "Office Furniture",
    subcategoryId: "table-employee",
    subcategoryName: "Employee Table",
    price: 5499,
    image: "/images-webp/employeetable4.webp",
    images: ["/images-webp/employeetable4.webp"],
    rating: 4.8,
    ratingCount: 28,
    description: "A functional work desk suitable for organized staff areas and professional office environments.",
  },
  {
    id: 114,
    name: "Contemporary Employee Desk",
    category: "Office Furniture",
    subcategoryId: "table-employee",
    subcategoryName: "Employee Table",
    price: 5499,
    image: "/images-webp/employeetable5.webp",
    images: ["/images-webp/employeetable5.webp"],
    rating: 4.8,
    ratingCount: 28,
    description: "A contemporary employee desk that brings a simple, professional appearance to modern workspaces.",
  },
  {
    id: 102,
    name: "Executive Office Desk",
    category: "Office Furniture",
    subcategoryId: "boss-table",
    subcategoryName: "Executive Table",
    price: 24999,
    oldPrice: 31000,
    discount: 19,
    image: "/uploads/mesa-diretor-com-conect-iii-charuto_pret-1792824881824-4207.jpg",
    images: [
      "/uploads/mesa-diretor-com-conect-iii-charuto_pret-1792824881824-4207.jpg",
      "/uploads/anderson-executive-desk-2_0m-reversible--1792824873667-697192.jpg"
    ],
    rating: 4.9,
    ratingCount: 19,
    badge: "Premium",
    description: "An executive office table designed to create a distinguished and professional management workspace.",
  },
  {
    id: 115,
    name: "Modern Executive Desk",
    category: "Office Furniture",
    subcategoryId: "boss-table",
    subcategoryName: "Executive Table",
    price: 24999,
    image: "/images-webp/bosstable2.webp",
    images: ["/images-webp/bosstable2.webp"],
    rating: 4.8,
    ratingCount: 16,
    description: "A modern executive desk suited to managerial cabins and professional office interiors.",
  },
  {
    id: 116,
    name: "Leadership Office Desk",
    category: "Office Furniture",
    subcategoryId: "boss-table",
    subcategoryName: "Executive Table",
    price: 24999,
    image: "/images-webp/bosstable3.webp",
    images: ["/images-webp/bosstable3.webp"],
    rating: 4.8,
    ratingCount: 14,
    description: "A premium office desk designed for leadership spaces, combining a refined appearance with everyday functionality.",
  },
  {
    id: 103,
    name: "Modular Office Workstation",
    category: "Office Furniture",
    subcategoryId: "workstation",
    subcategoryName: "Workstation",
    price: 38999,
    oldPrice: 48000,
    discount: 19,
    image: "/images-webp/workstation1.webp",
    images: ["/images-webp/workstation1.webp"],
    rating: 4.8,
    ratingCount: 34,
    badge: "Popular",
    description: "A modular workstation designed to support collaborative work and organized team seating in modern offices.",
  },
  {
    id: 119,
    name: "Organized Staff Office Workstation",
    category: "Office Furniture",
    subcategoryId: "workstation",
    subcategoryName: "Workstation",
    price: 38999,
    image: "/images-webp/workstation2.webp",
    images: ["/images-webp/workstation2.webp"],
    rating: 4.8,
    ratingCount: 22,
    description: "A practical workstation solution for creating structured, comfortable, and productive employee work areas.",
  },
  {
    id: 120,
    name: "Space-Saving Modular Workstation",
    category: "Office Furniture",
    subcategoryId: "workstation",
    subcategoryName: "Workstation",
    price: 38999,
    image: "/images-webp/workstation3.webp",
    images: ["/images-webp/workstation3.webp"],
    rating: 4.7,
    ratingCount: 18,
    description: "A space-conscious workstation designed to help offices maintain an efficient and well-organized layout.",
  },
  {
    id: 121,
    name: "Corporate Conference Table",
    category: "Office Furniture",
    subcategoryId: "conference-table",
    subcategoryName: "Conference Table",
    price: 19999,
    image: "/images-webp/conferencetable1.webp",
    images: ["/images-webp/conferencetable1.webp"],
    rating: 4.8,
    ratingCount: 18,
    description: "A professional conference table suitable for business meetings, team discussions, and corporate presentations.",
  },
  {
    id: 122,
    name: "Modern Boardroom Discussion Table",
    category: "Office Furniture",
    subcategoryId: "conference-table",
    subcategoryName: "Conference Table",
    price: 19999,
    image: "/images-webp/conferencetable2.webp",
    images: ["/images-webp/conferencetable2.webp"],
    rating: 4.7,
    ratingCount: 14,
    description: "A modern meeting table designed to support collaboration and productive discussions in professional environments.",
  },
  {
    id: 123,
    name: "Team Meeting Table",
    category: "Office Furniture",
    subcategoryId: "conference-table",
    subcategoryName: "Conference Table",
    price: 19999,
    image: "/images-webp/conferencetable3.webp",
    images: ["/images-webp/conferencetable3.webp"],
    rating: 4.8,
    ratingCount: 12,
    description: "A practical table for team meetings, planning sessions, and collaborative decision-making.",
  },
  {
    id: 104,
    name: "Wooden Office Storage Pedestal",
    category: "Office Furniture",
    subcategoryId: "wooden-pedestal",
    subcategoryName: "Pedestal",
    price: 4499,
    oldPrice: 5800,
    discount: 22,
    image: "/images-webp/woodenpedestial1.webp",
    images: ["/images-webp/woodenpedestial1.webp"],
    rating: 4.7,
    ratingCount: 21,
    description: "A wooden mobile pedestal designed to keep office essentials organized and easily accessible.",
  },
  {
    id: 124,
    name: "Compact Wooden Office Pedestal",
    category: "Office Furniture",
    subcategoryId: "wooden-pedestal",
    subcategoryName: "Pedestal",
    price: 4499,
    image: "/images-webp/woodenpedestial2.webp",
    images: ["/images-webp/woodenpedestial2.webp"],
    rating: 4.7,
    ratingCount: 18,
    description: "A compact wooden pedestal that offers a practical storage solution for organized workspaces.",
  },
  {
    id: 105,
    name: "Premium Front Office Desk",
    category: "Office Furniture",
    subcategoryId: "reception-table",
    subcategoryName: "Reception Desk",
    price: 21999,
    oldPrice: 27500,
    discount: 20,
    image: "/images-webp/receptiontable1.webp",
    images: ["/images-webp/receptiontable1.webp"],
    rating: 4.9,
    ratingCount: 16,
    badge: "Luxury",
    description: "A premium reception counter designed to create a welcoming first impression for visitors and clients.",
  },
  {
    id: 117,
    name: "Contemporary Reception Counter",
    category: "Office Furniture",
    subcategoryId: "reception-table",
    subcategoryName: "Reception Desk",
    price: 21999,
    image: "/images-webp/receptiontable2.webp",
    images: ["/images-webp/receptiontable2.webp"],
    rating: 4.8,
    ratingCount: 12,
    description: "A contemporary reception desk suitable for maintaining a polished and organized front office.",
  },
  {
    id: 118,
    name: "Corporate  Reception Desk",
    category: "Office Furniture",
    subcategoryId: "reception-table",
    subcategoryName: "Reception Desk",
    price: 21999,
    image: "/images-webp/receptiontable3.webp",
    images: ["/images-webp/receptiontable3.webp"],
    rating: 4.8,
    ratingCount: 14,
    description: "A professional welcome desk designed to support visitor assistance and daily reception activities.",
  },
  {
    id: 107,
    name: "Heavy-Duty Steel Office Table",
    category: "Office Furniture",
    subcategoryId: "metal-office-table",
    subcategoryName: "Metal Office Table",
    price: 6499,
    oldPrice: 8500,
    discount: 24,
    image: "/images-webp/steeltable1.webp",
    images: ["/images-webp/steeltable1.webp"],
    rating: 4.8,
    ratingCount: 31,
    badge: "Heavy Duty",
    description: "A heavy-duty steel office table designed for dependable everyday use in professional work areas.",
  },
  {
    id: 131,
    name: "Functional Steel Work Desk",
    category: "Office Furniture",
    subcategoryId: "metal-office-table",
    subcategoryName: "Metal Office Table",
    price: 6499,
    image: "/images-webp/steeltable2.webp",
    images: ["/images-webp/steeltable2.webp"],
    description: "A practical steel desk suitable for daily office tasks and organized workplace arrangements.",
  },
  {
    id: 132,
    name: "Contemporary Metal Office Desk",
    category: "Office Furniture",
    subcategoryId: "metal-office-table",
    subcategoryName: "Metal Office Table",
    price: 6499,
    image: "/images-webp/stelltable3.webp",
    images: ["/images-webp/stelltable3.webp"],
    description: "A metal office desk with a clean professional appearance for functional work environments.",
  },
  {
    id: 108,
    name: "Steel Mobile Storage Pedestal",
    category: "Office Furniture",
    subcategoryId: "metal-pedestal",
    subcategoryName: "Metal Pedestal",
    price: 5299,
    oldPrice: 6800,
    discount: 22,
    image: "/images-webp/pedestialsteel1.webp",
    images: ["/images-webp/pedestialsteel1.webp"],
    rating: 4.7,
    ratingCount: 18,
    description: "A steel mobile pedestal designed to provide convenient storage for everyday office essentials.",
  },
  {
    id: 126,
    name: "Compact Steel Office Pedestal",
    category: "Office Furniture",
    subcategoryId: "metal-pedestal",
    subcategoryName: "Metal Pedestal",
    price: 5299,
    image: "/images-webp/pedestialsteel3.webp",
    images: ["/images-webp/pedestialsteel3.webp"],
    description: "A compact steel storage pedestal that helps keep work areas neat and essential items within reach.",
  },
  {
    id: 127,
    name: "Professional Metal Storage Unit",
    category: "Office Furniture",
    subcategoryId: "metal-pedestal",
    subcategoryName: "Metal Pedestal",
    price: 5299,
    image: "/images-webp/pedestialsteel4.webp",
    images: ["/images-webp/pedestialsteel4.webp"],
    description: "A practical metal storage unit designed for organized and efficient office environments.",
  },
  {
    id: 109,
    name: "Metal Utility Work Table",
    category: "Office Furniture",
    subcategoryId: "metal-table",
    subcategoryName: "Metal Table",
    price: 5999,
    oldPrice: 7800,
    discount: 23,
    image: "/images-webp/metaltable.webp",
    images: ["/images-webp/metaltable.webp"],
    rating: 4.7,
    ratingCount: 15,
    description: "A versatile metal utility table suitable for everyday tasks in office and workshop environments.",
  },
  {
    id: 128,
    name: "Steel Utility Office Table",
    category: "Office Furniture",
    subcategoryId: "metal-table",
    subcategoryName: "Metal Table",
    price: 5999,
    image: "/images-webp/steeltable1.webp",
    images: ["/images-webp/steeltable1.webp"],
    description: "A steel utility table designed to provide a practical work surface for daily workplace activities.",
  },
  {
    id: 129,
    name: "Modern Steel Work Table",
    category: "Office Furniture",
    subcategoryId: "metal-table",
    subcategoryName: "Metal Table",
    price: 5999,
    image: "/images-webp/steeltable2.webp",
    images: ["/images-webp/steeltable2.webp"],
    description: "A modern steel table suitable for organized office tasks and general-purpose work areas.",
  },
  {
    id: 130,
    name: "Industrial Metal Utility Table",
    category: "Office Furniture",
    subcategoryId: "metal-table",
    subcategoryName: "Metal Table",
    price: 5999,
    image: "/images-webp/stelltable3.webp",
    images: ["/images-webp/stelltable3.webp"],
    description: "A functional metal table designed for practical use in office, commercial, and utility spaces.",
  },
],

  },

  // 2. Home Furniture (Coming Soon)
  {
    id: "home-furniture",
    name: "Home Furniture",
    badge: "Coming Soon",
    description:
      "Handcrafted living room sofas, luxury recliners, solid wood dining sets, and modern bedroom furniture.",
    featured: {
      title: "Artisanal Home Living",
      description: "Lounge seating, solid wood dining, and contemporary home decor collections.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&h=400&q=80",
    },
    subcategories: [
      { id: "kitchen-unit", name: "Kitchen Unit", path: "/category/home-furniture?sub=kitchen-unit" },
      { id: "sofas", name: "Sofas", path: "/category/home-furniture?sub=sofas" },
      { id: "tv-unit", name: "TV Unit", path: "/category/home-furniture?sub=tv-unit" },
      { id: "bar-unit", name: "Bar Unit", path: "/category/home-furniture?sub=bar-unit" },
      { id: "foldable-table", name: "Foldable Table", path: "/category/home-furniture?sub=foldable-table" },
      { id: "side-table", name: "Side Table", path: "/category/home-furniture?sub=side-table" },
      { id: "study-table", name: "Study Table", path: "/category/home-furniture?sub=study-table" },
    ],
    products: [
      {
        id: 401,
        name: "Luxe 3-Seater Velvet Living Room Sofa",
        category: "Home Furniture",
        subcategoryId: "sofas",
        subcategoryName: "Sofas",
        price: 32999,
        oldPrice: 42000,
        discount: 21,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 32,
        badge: "Coming Soon",
        description: "Opulent emerald velvet upholstery with high-resilience foam and tapered solid brass legs.",
      },
    ],
  },

  // 3. Seating Solutions
  {
    id: "seating-solutions",
    name: "Seating Solutions",
    badge: "Ergonomic",
    description:
      "Ergonomic mesh chairs, executive high-back chairs, office sofas, and visitor seating.",
    featured: {
      title: "Ergonomic & Executive Seating",
      description: "Engineered mesh revolving chairs, executive leather seating, and plush office sofas.",
      image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&h=400&q=80",
    },
    subcategories: [
      {
        id: "boss-chair",
        name: "Boss Chair",
        path: "/category/seating-solutions?sub=boss-chair",
        children: [
          { id: "premium-chair", name: "Premium Chair", path: "/category/seating-solutions?sub=premium-chair" },
          { id: "executive-chair", name: "Executive Chair", path: "/category/seating-solutions?sub=executive-chair" },
        ],
      },
      { id: "chair-set", name: "Chair Set", path: "/category/seating-solutions?sub=chair-set" },
      { id: "workstation-back-chair", name: "Workstation Mid-Back Chair", path: "/category/seating-solutions?sub=workstation-back-chair" },

      { id: "sling-chair", name: "Sleek Chair", path: "/category/seating-solutions?sub=sling-chair" },
      { id: "training-chair", name: "Training Chair", path: "/category/seating-solutions?sub=training-chair" },
      { id: "visitor-chair", name: "Visitor Chair", path: "/category/seating-solutions?sub=visitor-chair" },
    ],
   
products: [
  {
    id: 205,
    name: "Executive 3-Seater Leatherette Office Sofa",
    category: "Seating Solutions",
    subcategoryId: "office-sofa",
    subcategoryName: "Office Sofa",
    price: 24999,
    oldPrice: 32000,
    discount: 22,
    image: "/images-webp/officesopa1.webp",
    rating: 4.9,
    ratingCount: 27,
    badge: "Premium",
    description: "A three-seater office sofa designed for reception areas, visitor lounges, and professional interiors.",
  },
  {
    id: 216,
    name: "Compact Round Cushioned Stool",
    category: "Seating Solutions",
    subcategoryId: "stool",
    subcategoryName: "Stool",
    price: 2499,
    image: "/images-webp/stool2.webp",
    rating: 4.7,
    ratingCount: 16,
    description:  "A compact round cushioned stool designed for comfortable seating in offices, workshops, and multipurpose indoor spaces.",
  },
  {
    id: 217,
    name: "Height-Adjustable Utility Stool",
    category: "Seating Solutions",
    subcategoryId: "stool",
    subcategoryName: "Stool",
    price: 3299,
    image: "/images-webp/stool3.webp",
    rating: 4.8,
    ratingCount: 23,
    description: "A height-adjustable utility stool with a supportive seat, designed for flexible seating in laboratories, workshops, and workspaces.",
  },
  {
    id: 218,
    name: "Modern Multipurpose Seating Stool",
    category: "Seating Solutions",
    subcategoryId: "stool",
    subcategoryName: "Stool",
    price: 1999,
    image: "/images-webp/stool4.webp",
    rating: 4.6,
    ratingCount: 14,
    description:  "A versatile multipurpose stool suitable for offices, service areas, and everyday indoor seating.",
  },
  {

    id: 219,
    name: "Modern Office Sofa",
    category: "Seating Solutions",
    subcategoryId: "office-sofa",
    subcategoryName: "Office Sofa",
    price: 19999,
    image: "/images-webp/officesopa4.webp",
    rating: 4.8,
    ratingCount: 31,
    description: "A modern two-seater sofa designed for office reception areas, visitor lounges, and compact waiting spaces.",
  },
  {
    id: 220,
    name: "Premium Executive Waiting Sofa",
    category: "Seating Solutions",
    subcategoryId: "office-sofa",
    subcategoryName: "Office Sofa",
    price: 22999,
    image: "/images-webp/officesopa2.webp",
    rating: 4.9,
    ratingCount: 26,
    description: "A premium waiting sofa designed to create a welcoming and professional atmosphere in offices and commercial interiors.",
  },
  {
    id: 221,
    name: "Contemporary Office Lounge Sofa",
    category: "Seating Solutions",
    subcategoryId: "office-sofa",
    subcategoryName: "Office Sofa",
    price: 26999,
    image: "/images-webp/officesopa3.webp",
    rating: 4.7,
    ratingCount: 19,
    description: "A contemporary lounge sofa suitable for client waiting areas, reception spaces, and comfortable office seating arrangements.",
  },
],
  },
  // 4. Cupboards & Almirahs
  {
    id: "cupboards-almirahs",
    name: "Cupboards & Almirahs",
    badge: "Popular",
    description:
      "Secure steel cupboards, almirahs with mirrors, lockable office bookcases, and multi-tier storage units with durable powder-coat finish.",
    featured: {
      title: "Secure Steel Cupboards & Almirahs",
      description: "Heavy-gauge steel almirahs, lockable lockers, and multi-tier storage.",
      image: "/images-webp/cupboard1.webp",
    },
    subcategories: [
      { id: "storewell", name: "Storewells", path: "/category/cupboards-almirahs?sub=storewell", group: "Cupboards & Almirahs" },
      { id: "almirah", name: "Almirah", path: "/category/cupboards-almirahs?sub=almirah", group: "Cupboards & Almirahs" },
      {
        id: "unit-cupboard",
        name: "Unit Cupboard",
        path: "/category/cupboards-almirahs?sub=unit-cupboard",
        group: "Cupboards & Almirahs",
        children: [
          { id: "three-door-steel-storage", name: "3 Door Storage", path: "/category/cupboards-almirahs?sub=three-door-steel-storage" },
        ],
      },
      { id: "corporate-storage", name: "Corporate Storage", path: "/category/cupboards-almirahs?sub=corporate-storage", group: "Cupboards & Almirahs" },
      { id: "industrial-locker", name: "Industrial Locker", path: "/category/cupboards-almirahs?sub=industrial-locker", group: "Lockers" },
      { id: "filing-cabinet", name: "Filing Cabinet", path: "/category/cupboards-almirahs?sub=filing-cabinet", group: "Filing & Library Storage" },
      { id: "bookcase", name: "Bookcase", path: "/category/cupboards-almirahs?sub=bookcase", group: "Filing & Library Storage" },
      { id: "library-cupboard", name: "Library Cupboard", path: "/category/cupboards-almirahs?sub=library-cupboard", group: "Filing & Library Storage" },
    ],
    products: [
      {
        id: 110,
        name: "Prime Steel Office Storewell Cupboard",
        category: "Cupboards & Almirahs",
        subcategoryId: "storewell",
        subcategoryName: "Storewell",
        price: 18999,
        oldPrice: 22999,
        discount: 17,
        image: "/images-webp/cupboard1.webp",
        images: [
          "/images-webp/cupboard1.webp",
          "/images-webp/cupboard2.webp",
          "/images-webp/cupboard5.webp",
        ],
        rating: 4.9,
        ratingCount: 38,
        badge: "Heavy Duty",
        description: "Prime CRCA steel office storage almirah with internal security locker and multi-point lever lock.",
        sizes: [
          { label: "5.5 ft Compact", price: 17499, oldPrice: 20999 },
          { label: "6.5 ft Standard", price: 18999, oldPrice: 22999 },
        ],
      },
      {
        id: 701,
        name: "Premium Steel Storewell with Security Locker",
        category: "Cupboards & Almirahs",
        subcategoryId: "storewell",
        subcategoryName: "Storewell",
        price: 18999,
        oldPrice: 22999,
        discount: 17,
        image: "/images-webp/cupboard1.webp",
        rating: 4.9,
        ratingCount: 34,
        badge: "Bestseller",
        description:
          "A durable steel storewell featuring an internal security locker, reinforced shelves, and a reliable multi-point locking system for organized office storage.",
        specifications: [
          { label: "Material", value: "CRCA Prime Steel (20/22 Gauge)" },
          { label: "Finish", value: "Anti-Rust Epoxy Powder Coated" },
          { label: "Locking", value: "3-Way Multi-Point Key Lock" },
          { label: "Features", value: "Internal Locker, Full Shelves, Heavy Duty Hinges" },
        ],
      },
      {
        id: 702,
        name: "Heavy-Duty Steel Storewell with Hanging Space",
        category: "Cupboards & Almirahs",
        subcategoryId: "storewell",
        subcategoryName: "Storewell",
        price: 16499,
        oldPrice: 19999,
        discount: 18,
        image: "/images-webp/cupboard2.webp",
        rating: 4.8,
        ratingCount: 26,
        badge: "Durable",
        description:
           "A spacious two-door steel storewell with a top shelf, hanging rod, and adjustable storage compartments for convenient office and household organization.",
        specifications: [
          { label: "Dimensions", value: "78\" H x 36\" W x 19\" D" },
          { label: "Shelves", value: "4 Multi-Level Adjustable Shelves" },
          { label: "Warranty", value: "5 Years Anti-Corrosion Warranty" },
        ],
      },
      {
        id: 703,
        name:  "Industrial Compartment Staff Locker",
        category: "Cupboards & Almirahs",
        subcategoryId: "filing-cabinet",
        subcategoryName: "Filing Cabinet",
        price: 17499,
        oldPrice: 21000,
        discount: 17,
        image: "/images-webp/metal-drawer1.webp",
        rating: 4.8,
        ratingCount: 28,
        badge: "Industrial",
        description:
           "A multi-compartment steel locker designed for offices, factories, and gyms, featuring individual lockable sections and ventilation openings for personal storage.",
        specifications: [
          { label: "Doors", value: "6 Individual Lockable Compartments" },
          { label: "Ventilation", value: "Louver Air Vents on Each Door" },
        ],
      },
      {
        id: 704,
        name:  "Professional 4-Drawer Steel Filing Cabinet",
        category: "Cupboards & Almirahs",
        subcategoryId: "filing-cabinet",
        subcategoryName: "Filing Cabinet",
        price: 11499,
        oldPrice: 14500,
        discount: 21,
        image: "/images-webp/metal-drawer4.webp",
        rating: 4.7,
        ratingCount: 16,
        description:  "A vertical steel filing cabinet with four spacious drawers, designed to organize A4 and legal-size documents with convenient access and an anti-tilt mechanism.",
      },
        {
        id: 705,
        name:  "Classic Two-Door Steel Almirah",
        category: "Cupboards & Almirahs",
        subcategoryId: "almirah",
        subcategoryName: "Almirah",
        price: 16499,
        oldPrice: 19999,
        discount: 18,
        image: "/images-webp/cupboard4.webp",
        rating: 4.8,
        ratingCount: 29,
        description:
           "A sturdy two-door steel almirah with a secure locking system and durable powder-coated finish, ideal for organized storage at home or in the office.",
      },
      {
        id: 706,
        name: "Spacious Three-Door Steel Wardrobe",
        category: "Cupboards & Almirahs",
        subcategoryId: "almirah",
        subcategoryName: "Almirah",
        price: 19999,
        oldPrice: 24500,
        discount: 18,
        image: "/images-webp/cupboard3.webp",
        rating: 4.9,
        ratingCount: 38,
        badge: "Spacious",
        description:
          "A spacious three-door steel wardrobe designed for organized storage, with dedicated hanging space and shelving for clothing and everyday essentials.",
      },

      {
        id: 708,
        name:  "Heavy-Duty Three-Door Steel Storage Cabinet",
        category: "Cupboards & Almirahs",
        subcategoryId: "unit-cupboard",
        subcategoryName: "Unit Cupboard",
        price: 17999,
        oldPrice: 22000,
        discount: 18,
        image: "/images-webp/cupboard1.webp",
        images: [
          "/images-webp/cupboard1.webp",
          "/images-webp/cupboard2.webp",
          "/images-webp/cupboard5.webp",
        ],
        rating: 4.8,
        ratingCount: 22,
        badge: "Workshop",
        description: "A robust three-door steel cabinet designed for workshops and commercial spaces, offering organized storage with reinforced shelves and secure locking.",
      },
      {
        id: 709,
        name:  "Steel Library Cupboard with Glass Doors",
        category: "Cupboards & Almirahs",
        subcategoryId: "library-cupboard",
        subcategoryName: "Library Cupboard",
        price: 14999,
        oldPrice: 18500,
        discount: 19,
        image: "/images-webp/library1.webp",
        rating: 4.8,
        ratingCount: 24,
        description: "A durable steel library cupboard with transparent glass doors and multiple shelves, ideal for neatly storing and displaying books, files, and reference materials in libraries, schools, and offices.",
      },
      {
        id: 710,
        name: "Double-Door Steel Bookcase with Glass Panels",
        category: "Cupboards & Almirahs",
        subcategoryId: "library-cupboard",
        subcategoryName: "Library Cupboard",
        price: 16999,
        oldPrice: 21000,
        discount: 19,
        image: "/images-webp/library2.webp",
        rating: 4.9,
        ratingCount: 29,
        description: "A spacious steel bookcase featuring full-height glass-panel doors and multiple shelves, designed to keep books, documents, and records organized and protected.",
      },
    ],
  },
// 5. Outdoor Furniture
{
  id: "outdoor-furniture",
  name: "Outdoor Furniture",
  badge: "All-Weather",
  description:
    "Explore outdoor planters, metal tables, garden chairs, planter stands, racks, trolleys and durable steel storage solutions.",

  featured: {
    title: "All-Weather Garden & Patio Living",
    description:
      "Discover practical and stylish metal furniture and accessories for your garden, balcony and outdoor spaces.",
    image: "/metalplanter1.jpeg",
  },

  subcategories: [
    {
      id: "metal-planter",
      name: "Metal Planter",
      path: "/category/outdoor-furniture?sub=metal-planter",
      group: "Outdoor Furniture",
    },
    {
      id: "garden-chair",
      name: "Garden Chair",
      path: "/category/outdoor-furniture?sub=garden-chair",
      group: "Outdoor Seating & Tables",
    },
    {
      id: "metal-sofa",
      name: "Metal Sofa",
      path: "/category/seating-solutions?sub=metal-sofa",
      group: "Outdoor Seating & Tables",
    },
    {
      id: "planter-stand",
      name: "Planter Stand",
      path: "/category/outdoor-furniture?sub=planter-stand",
      group: "Outdoor Furniture",
    },
    {
      id: "planter-trolley-wheels",
      name: "Planter Trolley with Wheels",
      path: "/category/outdoor-furniture?sub=planter-trolley-wheels",
      group: "Outdoor Furniture",
    },
    {
      id: "metal-table",
      name: "Tables",
      path: "/category/outdoor-furniture?sub=metal-table",
      group: "Outdoor Seating & Tables",
    },
  ],

  products: [
    // Metal Planters
    {
      id: 501,
      name: " Modern Minimalist Metal Planter",
      category: "Outdoor Furniture",
      subcategoryId: "metal-planter",
      subcategoryName: "Metal Planter",
      price: 2499,
      image: "/metalplanter1.jpeg",
      description:
        " Enhance your garden or balcony with this elegant metal planter, designed to bring a clean and modern touch to your space.",
    },
    {
      id: 509,
      name: "Contemporary Stand Metal Planter",
      category: "Outdoor Furniture",
      subcategoryId: "metal-planter",
      subcategoryName: "Metal Planter",
      price: 2699,
      image: "/metalplanter2.jpeg",
      description:
        " A stylish planter with a sleek stand design, perfect for displaying indoor plants and adding a sophisticated look to your interiors.",
    },
    {
      id: 510,
      name: "Premium Geometric Metal Planter",
      category: "Outdoor Furniture",
      subcategoryId: "metal-planter",
      subcategoryName: "Metal Planter",
      price: 2899,
      image: "/metalplanter3.jpeg",
      description:
       " Featuring a modern geometric stand, this metal planter adds a refined decorative touch to living spaces, balconies and patios.",
    },
    {
      id: 511,
      name: "Elegant Gold-Finish Planter Stand",
      category: "Outdoor Furniture",
      subcategoryId: "metal-planter",
      subcategoryName: "Metal Planter",
      price: 2299,
      image: "/metalplanter4.jpeg",
      description:
        " Elevate your décor with this elegant gold-finish planter stand, ideal for showcasing greenery in contemporary homes and stylish outdoor spaces.",
    },
    {
      id: 512,
      name: "Luxury Gold Metal Planter Set",
      category: "Outdoor Furniture",
      subcategoryId: "metal-planter",
      subcategoryName: "Metal Planter",
      price: 3199,
      image: "/metalplanter5.jpeg",
      description:
        " Create a beautiful display with this gold-finish planter set, combining decorative elegance and greenery to complement modern interiors.",
    },

    // Metal Tables
    {
      id: 502,
      name:  "Stainless Steel Utility Table",
      category: "Outdoor Furniture",
      subcategoryId: "metal-table",
      subcategoryName: "Metal Table",
      price: 7499,
      image: "/gchair4.jpeg",
      description:
         "A sleek and durable stainless steel utility table, ideal for kitchens, workspaces and everyday commercial use.",
sizes: [
        { label: "3×2 ft", price: 7499 },
        { label: "5×2 ft", price: 11499 },
      ],
    },
    {
      id: 513,
      name:  "Heavy-Duty Stainless Steel Table",
      category: "Outdoor Furniture",
      subcategoryId: "metal-table",
      subcategoryName: "Metal Table",
      price: 7999,
      image: "/mtable2.jpeg",
      description:
        "Designed for durability and everyday performance, this sturdy metal table is suitable for commercial workspaces and utility areas.",
        sizes: [
  { label: "3×2 ft", price: 7999 },
  { label: "5×2 ft", price: 11999 },
],
    },
    {
      id: 514,
      name:"Industrial Metal Frame Table",
      category: "Outdoor Furniture",
      subcategoryId: "metal-table",
      subcategoryName: "Metal Table",
      price: 8499,
      image: "/mtable3.jpeg",
      description:
         "Featuring a strong geometric metal frame, this versatile table is ideal for outdoor settings, workshops and customized furniture applications.",
sizes: [
    { label: "3×2 ft", price: 8499 },
  { label: "5×2 ft", price: 12499 },
],
    },

    // Garden Chairs
    {
      id: 515,
      name: "Classic Wooden Folding Chair",
      category: "Outdoor Furniture",
      subcategoryId: "garden-chair",
      subcategoryName: "Garden Chair",
      price: 4299,
      image: "/gchair2.jpeg",
      description:
         "A timeless wooden folding chair designed for comfortable outdoor seating, ideal for gardens, patios and compact balcony spaces.",
    },
    {
      id: 516,
      name: "Elegant Wooden Armrest Chair",
      category: "Outdoor Furniture",
      subcategoryId: "garden-chair",
      subcategoryName: "Garden Chair",
      price: 4499,
      image: "/gchair3.jpeg",
      description:
          "Featuring a warm wooden finish and supportive armrests, this chair adds natural charm to gardens, patios and outdoor seating areas.",
    },
    {
      id: 517,
      name:  "Modern Woven Garden Chair Set",
      category: "Outdoor Furniture",
      subcategoryId: "garden-chair",
      subcategoryName: "Garden Chair",
      price: 4799,
      image: "/gchair3.jpeg",
      description:
         "Enhance your outdoor dining experience with stylish woven chairs and a coordinated table, perfect for balconies, patios and garden gatherings.",
    },

    // Steel Storage Units
    {
      id: 504,
      name: "Heavy-Duty Black Steel Storage Rack",
      category: "Outdoor Furniture",
      subcategoryId: "steel-storage-unit",
      subcategoryName: "Steel Storage Unit",
      price: 12999,
      image: "/ssunit1.jpeg",
      description:
         "Maximize your storage space with this sturdy black steel rack, featuring multiple shelves for organizing tools, equipment and everyday essentials.",
    },
    {
      id: 518,
      name: "Multi-Tier Metal Storage Rack",
      category: "Outdoor Furniture",
      subcategoryId: "steel-storage-unit",
      subcategoryName: "Steel Storage Unit",
      price: 13999,
      image: "/ssunit2.jpeg",
      description:
        "A versatile multi-tier metal rack designed for efficient storage and easy organization in warehouses, workshops, garages and utility spaces.",
    },
    {
      id: 519,
      name:  "Compact Industrial Steel Shelf",
      category: "Outdoor Furniture",
      subcategoryId: "steel-storage-unit",
      subcategoryName: "Steel Storage Unit",
      price: 14999,
      image: "/ssunit3.jpeg",
      description:
          "Featuring a space-saving design and a strong metal frame, this compact shelving unit is ideal for organizing supplies and accessories in homes or workspaces.",
    },

    // Planter Stands
    {
      id: 506,
      name: "Multi-Tier Metal Plant Stand",
      category: "Outdoor Furniture",
      subcategoryId: "planter-stand",
      subcategoryName: "Planter Stand",
      price: 2999,
      image: "/pstand1.jpeg",
      description:
         "Organize and display your favourite plants with this elegant multi-tier metal stand, perfect for living rooms, balconies and indoor gardens.",
    },
    {
      id: 520,
      name:  "Modern Slatted Planter Bench",
      category: "Outdoor Furniture",
      subcategoryId: "planter-stand",
      subcategoryName: "Planter Stand",
      price: 3299,
      image: "/pstand2.jpeg",
      description:
       "Featuring a sleek slatted design, this versatile planter stand offers a stylish way to arrange potted plants in gardens, patios and outdoor spaces.",
    },
    {
      id: 521,
      name: "Foldable Metal Planter Stand",
      category: "Outdoor Furniture",
      subcategoryId: "planter-stand",
      subcategoryName: "Planter Stand",
      price: 3499,
      image: "/pstand3.jpeg",
      description:
        "A space-efficient metal plant stand with a foldable-style structure, designed to display plants neatly on balconies, patios and compact outdoor areas.",
    },
    {
      id: 522,
      name: "Geometric Multi-Level Plant Stand",
      category: "Outdoor Furniture",
      subcategoryId: "planter-stand",
      subcategoryName: "Planter Stand",
      price: 3799,
      image: "/pstand4.jpeg",
      description:
       "Showcase your greenery with this contemporary multi-level metal stand, featuring a geometric design that adds visual interest to gardens and balconies.",
    },

    // Planter Racks
    {
      id: 507,
      name: "Wooden Slat Metal Plant Rack",
      category: "Outdoor Furniture",
      subcategoryId: "planter-rack",
      subcategoryName: "Planter Rack",
      price: 3699,
      image: "/prack1.jpeg",
      description:
        "Combine style and functionality with this multi-tier plant rack featuring wooden slats and a sturdy metal frame, ideal for balconies, patios and garden spaces.",
    },
    {
      id: 523,
      name:"Corner Metal Planter Rack",
      category: "Outdoor Furniture",
      subcategoryId: "planter-rack",
      subcategoryName: "Planter Rack",
      price: 3999,
      image: "/prack2.jpeg",
      description:
        "Make the most of unused corners with this space-saving metal planter rack, designed to display potted plants neatly on balconies and outdoor areas.",
    },
    {
      id: 524,
      name: "Heavy-Duty Multi-Level Plant Rack",
      category: "Outdoor Furniture",
      subcategoryId: "planter-rack",
      subcategoryName: "Planter Rack",
      price: 4299,
      image: "/prack3.jpeg",
      description:
         "Organize your plants with this spacious multi-level metal rack, offering a practical display solution for gardens, patios and outdoor spaces.",
    },

    // Planter Trolleys
    {
      id: 508,
      name: "Rectangular Metal Plant Trolley",
      category: "Outdoor Furniture",
      subcategoryId: "planter-trolley-wheels",
      subcategoryName: "Planter Trolley with Wheels",
      price: 1499,
      image: "/ptrolly1.jpeg",
      description:
         "Move your potted plants effortlessly with this rectangular metal trolley, featuring a sturdy frame and smooth-rolling wheels for convenient plant placement.",
    },
    {
      id: 525,
      name:  "Round Metal Plant Caddy",
      category: "Outdoor Furniture",
      subcategoryId: "planter-trolley-wheels",
      subcategoryName: "Planter Trolley with Wheels",
      price: 1699,
      image: "/ptrolly2.jpeg",
      description:
         "Designed for convenient plant movement, this round metal trolley provides a practical base for moving and repositioning planters with ease.",
    },
    {
      id: 526,
      name: "Heavy-Duty Round Planter Trolley",
      category: "Outdoor Furniture",
      subcategoryId: "planter-trolley-wheels",
      subcategoryName: "Planter Trolley with Wheels",
      price: 1799,
      image: "/ptrolly3.jpeg",
      description:
          "A practical round planter trolley with caster wheels, ideal for moving large pots and keeping your plants easy to access and reposition.",
    },
    {
      id: 527,
      name: "Square Wheeled Plant Stand",
      category: "Outdoor Furniture",
      subcategoryId: "planter-trolley-wheels",
      subcategoryName: "Planter Trolley with Wheels",
      price: 1899,
      image: "/ptrolly4.jpeg",
      description:
         "Keep your plants mobile with this square metal trolley, designed to support convenient movement and flexible placement in gardens, balconies and patios.",
    },
    {
      id: 528,
      name: "Round Metal Planter Dolly",
      category: "Outdoor Furniture",
      subcategoryId: "planter-trolley-wheels",
      subcategoryName: "Planter Trolley with Wheels",
      price: 1999,
      image: "/ptrolly5.jpeg",
      description:
        "A compact round metal plant dolly designed to make repositioning potted plants simple and convenient in indoor and outdoor spaces.",
    },
  ],
},

  // 6. Bunk Beds
  {
    id: "bunk-beds",
    name: "Bunk Beds",
    badge: "Durable",
    description:
      "Heavy-duty metal bunk beds and space-saving double-decker solutions for hostels, PG accommodations, and homes.",
    featured: {
      title: "Heavy-Duty Metal Bunk Beds",
      description: "Space-saving double-decker beds designed for hostels, PGs, and homes.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&h=400&q=80",
    },
    subcategories: [
      { id: "commercial-bunk-bed", name: "Commercial Bunk Bed", path: "/category/bunk-beds?sub=commercial-bunk-bed" },
      { id: "hostel", name: "Hostel Bunk Bed", path: "/category/bunk-beds?sub=hostel" },
      { id: "kids", name: "Residential Bunk Bed", path: "/category/bunk-beds?sub=kids" },
    ],
    products: [
      // Commercial Bunk Bed — 1
{
  id: 601,
  name: "Commercial Bunk Bed — Heavy Duty Double Decker",
  category: "Bunk Beds",
  subcategoryId: "commercial-bunk-bed",
  subcategoryName: "Commercial Bunk Bed",
  price: 13999,
  oldPrice: 17500,
  discount: 20,
  image: "/images-webp/comercialbunk1.webp",
  rating: 4.8,
  ratingCount: 31,
  badge: "Heavy Duty",
  description:
    "A heavy-duty steel bunk bed designed for hostels, PG accommodations, dormitories, and commercial spaces. Its space-saving double-decker design makes it suitable for everyday use.",
},

// Commercial Bunk Bed — 2
{
  id: 605,
  name: "Commercial Bunk Bed — Steel Frame Design",
  category: "Bunk Beds",
  subcategoryId: "commercial-bunk-bed",
  subcategoryName: "Commercial Bunk Bed",
  price: 14999,
  oldPrice: 18000,
  discount: 17,
  image: "/images-webp/commercialbunk2.webp",
  rating: 4.7,
  ratingCount: 24,
  badge: "Commercial",
  description:
    "A practical commercial bunk bed featuring a sturdy steel-frame design. Ideal for accommodation facilities that need durable, space-efficient sleeping arrangements.",
},

// Home Bunk Bed
{
  id: 602,
  name: "Home Bunk Bed — Stylish Steel Double Decker",
  category: "Bunk Beds",
  subcategoryId: "home",
  subcategoryName: "Home Bunk Bed",
  price: 11499,
  oldPrice: 14000,
  discount: 18,
  image: "/images-webp/homebunk1.webp",
  rating: 4.7,
  ratingCount: 22,
  badge: "Family Favourite",
  description:
    "A stylish steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a practical solution for families while maintaining a neat, modern look.",
},

// Hostel Bunk Bed — 1
{
  id: 604,
  name: "Hostel Bunk Bed — Institutional Grade Steel",
  category: "Bunk Beds",
  subcategoryId: "hostel",
  subcategoryName: "Hostel Bunk Bed",
  price: 15499,
  oldPrice: 19000,
  discount: 18,
  image: "/images-webp/hostelbunk1.webp",
  rating: 4.8,
  ratingCount: 45,
  badge: "Institutional",
  description:
    "A robust steel bunk bed designed for hostels, schools, training centres, and dormitories. Its double-decker structure helps maximise available floor space.",
},

// Hostel Bunk Bed — 2
{
  id: 606,
  name: "Hostel Bunk Bed — Space Saving Design",
  category: "Bunk Beds",
  subcategoryId: "hostel",
  subcategoryName: "Hostel Bunk Bed",
  price: 14499,
  oldPrice: 17500,
  discount: 17,
  image: "/images-webp/hostelbunk2.webp",
  rating: 4.7,
  ratingCount: 28,
  badge: "Space Saver",
  description:
    "A space-efficient bunk bed for shared accommodation and hostel rooms. Designed to provide two sleeping levels while making better use of limited room space.",
},

// Kids Bunk Bed — 1
{
  id: 603,
  name: "Kids Bunk Bed — Safe & Colorful Design",
  category: "Bunk Beds",
  subcategoryId: "kids",
  subcategoryName: "Kids Bunk Bed",
  price: 9999,
  oldPrice: 12500,
  discount: 20,
  image: "/images-webp/kidbunk1.webp",
  rating: 4.9,
  ratingCount: 38,
  badge: "Kids Special",
  description:
    "A space-saving bunk bed designed for children's bedrooms. Its double-decker layout provides a practical sleeping arrangement for shared rooms.",
},

// Kids Bunk Bed — 2
{
  id: 607,
  name: "Kids Bunk Bed — Modern Bedroom Style",
  category: "Bunk Beds",
  subcategoryId: "kids",
  subcategoryName: "Kids Bunk Bed",
  price: 10999,
  oldPrice: 13500,
  discount: 19,
  image: "/images-webp/kidbunk2.webp",
  rating: 4.8,
  ratingCount: 26,
  badge: "Modern Design",
  description:
    "A modern bunk bed that combines a space-saving structure with a stylish look for children's bedrooms and shared sleeping spaces.",
},

// Kids Bunk Bed — 3
{
  id: 608,
  name: "Kids Bunk Bed — Compact Double Decker",
  category: "Bunk Beds",
  subcategoryId: "kids",
  subcategoryName: "Kids Bunk Bed",
  price: 10499,
  oldPrice: 13000,
  discount: 19,
  image: "/images-webp/kidbunk3.webp",
  rating: 4.7,
  ratingCount: 21,
  badge: "Compact",
  description:
    "A compact double-decker bunk bed designed to make efficient use of bedroom space while providing a convenient sleeping arrangement for children.",
},

// Kids Bunk Bed — 4
{
  id: 609,
  name: "Kids Bunk Bed — Contemporary Design",
  category: "Bunk Beds",
  subcategoryId: "kids",
  subcategoryName: "Kids Bunk Bed",
  price: 11999,
  oldPrice: 14500,
  discount: 17,
  image: "/images-webp/kidbunk4.webp",
  rating: 4.8,
  ratingCount: 29,
  badge: "Popular",
  description:
    "A contemporary bunk bed suitable for children's rooms and shared bedrooms. Its vertical sleeping arrangement helps create more usable space in the room.",
},
{
  id: 610,
  name: "Home Bunk Bed — Modern Steel Double Decker",
  category: "Bunk Beds",
  subcategoryId: "home",
  subcategoryName: "Home Bunk Bed",
  price: 12499,
  oldPrice: 15000,
  discount: 17,
  image: "/images-webp/homebunk2.webp",
  rating: 4.8,
  ratingCount: 25,
  badge: "Modern Design",
  description:
    "A modern steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a comfortable and practical sleeping arrangement while keeping the room organised.",
},
    ],
  },

  // 7. Metal Racks
  
  {
  id: "metal-racks",
  name: "Metal Racks",
  badge: "",
  description: "",
  featured: {
    title: "",
    description: "",
    image: "",
  },
  subcategories: [],
  products: [],
},
];

