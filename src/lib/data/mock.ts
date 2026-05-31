// Mock data matching the database seed for DEAL platform MVP

export interface ServiceItem {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  categoryId: string;
  price: number;
  rating: number;
  totalReviews: number;
  providerName: string;
  providerNameFr: string;
  providerRating: number;
  isAvailable: boolean;
  categoryName: string;
  categoryNameFr: string;
}

export interface ProductItem {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  categoryId: string;
  price: number;
  stock: number;
  unit: string;
  rating: number;
  totalReviews: number;
  merchantName: string;
  merchantNameFr: string;
  categoryName: string;
  categoryNameFr: string;
}

export interface EquipmentItem {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  rating: number;
  totalReviews: number;
  ownerName: string;
  ownerNameFr: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  count: number;
}

// Service Categories
export const serviceCategories: Category[] = [
  { id: 'elec', name: 'كهرباء وإلكترونيات', nameFr: 'Électricité et Électronique', icon: 'Zap', count: 3 },
  { id: 'plumb', name: 'سباكة وتجهيزات صحية', nameFr: 'Plomberie et Sanitaires', icon: 'Droplets', count: 3 },
  { id: 'build', name: 'بناء وترميم', nameFr: 'Construction et Rénovation', icon: 'HardHat', count: 3 },
  { id: 'carp', name: 'نجارة وأثاث', nameFr: 'Menuiserie et Meubles', icon: 'Hammer', count: 3 },
  { id: 'hvac', name: 'تبريد وتكييف', nameFr: 'Climatisation et Réfrigération', icon: 'Wind', count: 2 },
  { id: 'metal', name: 'حدادة وأشغال معدنية', nameFr: 'Ferronnerie et Travaux Métalliques', icon: 'Wrench', count: 3 },
  { id: 'paint', name: 'دهان وديكور', nameFr: 'Peinture et Décoration', icon: 'PaintBucket', count: 1 },
  { id: 'clean', name: 'صيانة منزلية', nameFr: 'Entretien Ménager', icon: 'Home', count: 1 },
];

// Product Categories
export const productCategories: Category[] = [
  { id: 'cement', name: 'مواد بناء', nameFr: 'Matériaux de Construction', icon: 'Brick', count: 4 },
  { id: 'wire', name: 'أسلاك ومعدات كهربائية', nameFr: 'Câbles et Équipements Électriques', icon: 'Cable', count: 3 },
  { id: 'wood', name: 'أخشاب ومواد نجارة', nameFr: 'Bois et Matériaux de Menuiserie', icon: 'TreePine', count: 2 },
  { id: 'plumbing-mat', name: 'مواد سباكة', nameFr: 'Matériaux de Plomberie', icon: 'Pipette', count: 1 },
  { id: 'paint-mat', name: 'دهانات وأدوات', nameFr: 'Peintures et Outils', icon: 'Palette', count: 1 },
  { id: 'tools', name: 'أدوات يدوية', nameFr: 'Outils à Main', icon: 'Screwdriver', count: 1 },
];

// Services
export const services: ServiceItem[] = [
  {
    id: 's1', title: 'تركيب إنارة كاملة', titleFr: 'Installation électrique complète',
    description: 'تركيب كامل للإنارة المنزلية مع أسلاك ولمبات حديثة', descriptionFr: "Installation complète de l'éclairage domestique",
    categoryId: 'elec', price: 15000, rating: 4.8, totalReviews: 15,
    providerName: 'كريم بن أحمد', providerNameFr: 'Karim Ben Ahmed', providerRating: 4.8,
    isAvailable: true, categoryName: 'كهرباء وإلكترونيات', categoryNameFr: 'Électricité et Électronique',
  },
  {
    id: 's2', title: 'إصلاح أعطال كهربائية', titleFr: 'Réparation de pannes électriques',
    description: 'تشخيص وإصلاح جميع الأعطال الكهربائية المنزلية', descriptionFr: 'Diagnostic et réparation de toutes les pannes électriques',
    categoryId: 'elec', price: 3000, rating: 4.7, totalReviews: 27,
    providerName: 'كريم بن أحمد', providerNameFr: 'Karim Ben Ahmed', providerRating: 4.8,
    isAvailable: true, categoryName: 'كهرباء وإلكترونيات', categoryNameFr: 'Électricité et Électronique',
  },
  {
    id: 's3', title: 'توسيع شبكة كهربائية', titleFr: 'Extension de réseau électrique',
    description: 'توسيع وترقية الشبكة الكهربائية الحالية', descriptionFr: 'Extension et mise à niveau du réseau électrique existant',
    categoryId: 'elec', price: 20000, rating: 4.6, totalReviews: 8,
    providerName: 'كريم بن أحمد', providerNameFr: 'Karim Ben Ahmed', providerRating: 4.8,
    isAvailable: true, categoryName: 'كهرباء وإلكترونيات', categoryNameFr: 'Électricité et Électronique',
  },
  {
    id: 's4', title: 'إصلاح تسربات المياه', titleFr: "Réparation de fuites d'eau",
    description: 'كشف وإصلاح جميع أنواع التسربات المائية', descriptionFr: 'Détection et réparation de tous types de fuites',
    categoryId: 'plumb', price: 4000, rating: 4.5, totalReviews: 20,
    providerName: 'عمر بلقاسم', providerNameFr: 'Omar Belkacem', providerRating: 4.5,
    isAvailable: true, categoryName: 'سباكة وتجهيزات صحية', categoryNameFr: 'Plomberie et Sanitaires',
  },
  {
    id: 's5', title: 'تركيب سخان مياه', titleFr: 'Installation de chauffe-eau',
    description: 'تركيب وصيانة سخانات المياه بأنواعها', descriptionFr: 'Installation et entretien de chauffe-eau',
    categoryId: 'plumb', price: 8000, rating: 4.6, totalReviews: 12,
    providerName: 'عمر بلقاسم', providerNameFr: 'Omar Belkacem', providerRating: 4.5,
    isAvailable: true, categoryName: 'سباكة وتجهيزات صحية', categoryNameFr: 'Plomberie et Sanitaires',
  },
  {
    id: 's6', title: 'تركيب حوض مطبخ', titleFr: "Installation d'évier de cuisine",
    description: 'تركيب وتوصيل أحواض المطبخ والحمام', descriptionFr: "Installation et raccordement d'éviers",
    categoryId: 'plumb', price: 6000, rating: 4.4, totalReviews: 9,
    providerName: 'عمر بلقاسم', providerNameFr: 'Omar Belkacem', providerRating: 4.5,
    isAvailable: true, categoryName: 'سباكة وتجهيزات صحية', categoryNameFr: 'Plomberie et Sanitaires',
  },
  {
    id: 's7', title: 'تصنيع أثاث مخصص', titleFr: 'Fabrication de meubles sur mesure',
    description: 'تصنيع أثاث خشبي حسب الطلب بأجود أنواع الأخشاب', descriptionFr: 'Fabrication de meubles en bois sur commande',
    categoryId: 'carp', price: 50000, rating: 4.9, totalReviews: 18,
    providerName: 'يوسف مزياني', providerNameFr: 'Youcef Meziani', providerRating: 4.9,
    isAvailable: true, categoryName: 'نجارة وأثاث', categoryNameFr: 'Menuiserie et Meubles',
  },
  {
    id: 's8', title: 'صيانة وتجديد الأثاث', titleFr: 'Restauration de meubles',
    description: 'تجديد وإصلاح الأثاث الخشبي القديم', descriptionFr: 'Rénovation et réparation de meubles anciens',
    categoryId: 'carp', price: 15000, rating: 4.8, totalReviews: 14,
    providerName: 'يوسف مزياني', providerNameFr: 'Youcef Meziani', providerRating: 4.9,
    isAvailable: true, categoryName: 'نجارة وأثاث', categoryNameFr: 'Menuiserie et Meubles',
  },
  {
    id: 's9', title: 'تركيب أثاث مطبخ', titleFr: 'Installation de cuisine',
    description: 'تركيب مطابخ كاملة مع خزائن وأرفف', descriptionFr: 'Installation de cuisines complètes',
    categoryId: 'carp', price: 35000, rating: 4.7, totalReviews: 10,
    providerName: 'يوسف مزياني', providerNameFr: 'Youcef Meziani', providerRating: 4.9,
    isAvailable: true, categoryName: 'نجارة وأثاث', categoryNameFr: 'Menuiserie et Meubles',
  },
  {
    id: 's10', title: 'تركيب وتصليح تكييف', titleFr: 'Installation et réparation de climatisation',
    description: 'تركيب وصيانة جميع أنواع المكيفات', descriptionFr: 'Installation et entretien de tous types de climatiseurs',
    categoryId: 'hvac', price: 12000, rating: 4.6, totalReviews: 16,
    providerName: 'علي شريف', providerNameFr: 'Ali Cherif', providerRating: 4.6,
    isAvailable: true, categoryName: 'تبريد وتكييف', categoryNameFr: 'Climatisation et Réfrigération',
  },
  {
    id: 's11', title: 'صيانة دورية للتكييف', titleFr: 'Entretien périodique de climatisation',
    description: 'تنظيف وفحص وصيانة دورية لأجهزة التكييف', descriptionFr: 'Nettoyage, inspection et entretien périodique',
    categoryId: 'hvac', price: 5000, rating: 4.5, totalReviews: 22,
    providerName: 'علي شريف', providerNameFr: 'Ali Cherif', providerRating: 4.6,
    isAvailable: true, categoryName: 'تبريد وتكييف', categoryNameFr: 'Climatisation et Réfrigération',
  },
  {
    id: 's12', title: 'ترميم شامل للمنزل', titleFr: 'Rénovation complète de maison',
    description: 'ترميم وتجديد كامل للمنازل والشقق', descriptionFr: 'Rénovation complète de maisons et appartements',
    categoryId: 'build', price: 200000, rating: 4.8, totalReviews: 30,
    providerName: 'محمد بن عيسى', providerNameFr: 'Mohamed Ben Aissa', providerRating: 4.7,
    isAvailable: true, categoryName: 'بناء وترميم', categoryNameFr: 'Construction et Rénovation',
  },
  {
    id: 's13', title: 'أعمال طلاء ودهان', titleFr: 'Travaux de peinture',
    description: 'دهان داخلي وخارجي بأفضل أنواع الطلاء', descriptionFr: 'Peinture intérieure et extérieure',
    categoryId: 'build', price: 80000, rating: 4.6, totalReviews: 18,
    providerName: 'محمد بن عيسى', providerNameFr: 'Mohamed Ben Aissa', providerRating: 4.7,
    isAvailable: true, categoryName: 'بناء وترميم', categoryNameFr: 'Construction et Rénovation',
  },
  {
    id: 's14', title: 'صيانة عامة للمنزل', titleFr: 'Entretien général de maison',
    description: 'خدمات صيانة شاملة للمنازل', descriptionFr: "Services d'entretien complet pour maisons",
    categoryId: 'clean', price: 10000, rating: 4.5, totalReviews: 7,
    providerName: 'محمد بن عيسى', providerNameFr: 'Mohamed Ben Aissa', providerRating: 4.7,
    isAvailable: true, categoryName: 'صيانة منزلية', categoryNameFr: 'Entretien Ménager',
  },
  {
    id: 's15', title: 'صناعة أبواب ألمنيوم', titleFr: 'Fabrication de portes en aluminium',
    description: 'تصنيع وتركيب أبواب ونوافذ ألمنيوم', descriptionFr: 'Fabrication et installation de portes et fenêtres en aluminium',
    categoryId: 'metal', price: 25000, rating: 4.4, totalReviews: 13,
    providerName: 'سالم بوحمد', providerNameFr: 'Salim Bouhamed', providerRating: 4.4,
    isAvailable: true, categoryName: 'حدادة وأشغال معدنية', categoryNameFr: 'Ferronnerie et Travaux Métalliques',
  },
  {
    id: 's16', title: 'هياكل معدنية', titleFr: 'Structures métalliques',
    description: 'تصنيع هياكل معدنية وديكورات حديدية', descriptionFr: 'Fabrication de structures métalliques',
    categoryId: 'metal', price: 30000, rating: 4.5, totalReviews: 8,
    providerName: 'سالم بوحمد', providerNameFr: 'Salim Bouhamed', providerRating: 4.4,
    isAvailable: true, categoryName: 'حدادة وأشغال معدنية', categoryNameFr: 'Ferronnerie et Travaux Métalliques',
  },
  {
    id: 's17', title: 'دهان داخلي احترافي', titleFr: 'Peinture intérieure professionnelle',
    description: 'دهان احترافي لجميع الغرف بتصاميم حديثة', descriptionFr: 'Peinture professionnelle pour toutes les pièces',
    categoryId: 'paint', price: 60000, rating: 4.7, totalReviews: 11,
    providerName: 'سالم بوحمد', providerNameFr: 'Salim Bouhamed', providerRating: 4.4,
    isAvailable: true, categoryName: 'دهان وديكور', categoryNameFr: 'Peinture et Décoration',
  },
];

// Products
export const products: ProductItem[] = [
  {
    id: 'p1', title: 'إسمنت GRE 42.5', titleFr: 'Ciment GRE 42.5',
    description: 'إسمنت عالي الجودة مناسب لجميع أعمال البناء', descriptionFr: 'Ciment haute qualité pour tous travaux de construction',
    categoryId: 'cement', price: 1200, stock: 500, unit: 'bag', rating: 4.5, totalReviews: 10,
    merchantName: 'مؤسسة البناء الحديث', merchantNameFr: 'Bati Modern',
    categoryName: 'مواد بناء', categoryNameFr: 'Matériaux de Construction',
  },
  {
    id: 'p2', title: 'رمل خشن مغسول', titleFr: 'Sable lavé',
    description: 'رمل خشن مغسول مناسب لأعمال البناء والخرسانة', descriptionFr: 'Sable lavé pour construction et béton',
    categoryId: 'cement', price: 5000, stock: 200, unit: 'm3', rating: 4.3, totalReviews: 8,
    merchantName: 'مؤسسة البناء الحديث', merchantNameFr: 'Bati Modern',
    categoryName: 'مواد بناء', categoryNameFr: 'Matériaux de Construction',
  },
  {
    id: 'p3', title: 'حديد تسليح 12mm', titleFr: 'Fer à béton 12mm',
    description: 'حديد تسليح بأطوال مختلفة', descriptionFr: 'Fer à béton de différentes longueurs',
    categoryId: 'cement', price: 800, stock: 1000, unit: 'bar', rating: 4.4, totalReviews: 6,
    merchantName: 'مؤسسة البناء الحديث', merchantNameFr: 'Bati Modern',
    categoryName: 'مواد بناء', categoryNameFr: 'Matériaux de Construction',
  },
  {
    id: 'p4', title: 'طوب أحمر 12 ثقب', titleFr: 'Brique rouge 12 trous',
    description: 'طوب أحمر عالي الجودة 12 ثقب', descriptionFr: 'Brique rouge haute qualité 12 trous',
    categoryId: 'cement', price: 35, stock: 50000, unit: 'piece', rating: 4.2, totalReviews: 15,
    merchantName: 'مؤسسة البناء الحديث', merchantNameFr: 'Bati Modern',
    categoryName: 'مواد بناء', categoryNameFr: 'Matériaux de Construction',
  },
  {
    id: 'p5', title: 'أسلاك كهربائية 2.5mm', titleFr: 'Câbles électriques 2.5mm',
    description: 'أسلاك نحاسية معزولة للتمديدات المنزلية', descriptionFr: 'Câbles en cuivre isolés pour installations domestiques',
    categoryId: 'wire', price: 4500, stock: 300, unit: 'roll', rating: 4.7, totalReviews: 12,
    merchantName: 'مؤسسة الكهرباء والأنوار', merchantNameFr: 'Electro Lumière',
    categoryName: 'أسلاك ومعدات كهربائية', categoryNameFr: 'Câbles et Équipements Électriques',
  },
  {
    id: 'p6', title: 'لوحة كهربائية مقسمة', titleFr: 'Tableau électrique divisionnaire',
    description: 'لوحة كهربائية مقسمة بأحجام مختلفة', descriptionFr: 'Tableau électrique divisionnaire tailles variées',
    categoryId: 'wire', price: 15000, stock: 20, unit: 'piece', rating: 4.6, totalReviews: 8,
    merchantName: 'مؤسسة الكهرباء والأنوار', merchantNameFr: 'Electro Lumière',
    categoryName: 'أسلاك ومعدات كهربائية', categoryNameFr: 'Câbles et Équipements Électriques',
  },
  {
    id: 'p7', title: 'ألمبيات LED 18 واط', titleFr: 'Ampoules LED 18W',
    description: 'إضاءة LED اقتصادية وعملية', descriptionFr: 'Éclairage LED économique',
    categoryId: 'wire', price: 350, stock: 500, unit: 'piece', rating: 4.8, totalReviews: 20,
    merchantName: 'مؤسسة الكهرباء والأنوار', merchantNameFr: 'Electro Lumière',
    categoryName: 'أسلاك ومعدات كهربائية', categoryNameFr: 'Câbles et Équipements Électriques',
  },
  {
    id: 'p8', title: 'خشب زان أوروبي', titleFr: 'Hêtre européen',
    description: 'خشب زان أوروبي جاف ومشرب بجودة عالية', descriptionFr: 'Hêtre européen sec et traité haute qualité',
    categoryId: 'wood', price: 25000, stock: 50, unit: 'm3', rating: 4.6, totalReviews: 5,
    merchantName: 'الأخشاب الطبيعية', merchantNameFr: 'Bois Nature',
    categoryName: 'أخشاب ومواد نجارة', categoryNameFr: 'Bois et Matériaux de Menuiserie',
  },
  {
    id: 'p9', title: 'لوح MDF 18mm', titleFr: 'Panneau MDF 18mm',
    description: 'لوح MDF بأحجام مختلفة', descriptionFr: 'Panneau MDF tailles variées',
    categoryId: 'wood', price: 3500, stock: 200, unit: 'sheet', rating: 4.4, totalReviews: 7,
    merchantName: 'الأخشاب الطبيعية', merchantNameFr: 'Bois Nature',
    categoryName: 'أخشاب ومواد نجارة', categoryNameFr: 'Bois et Matériaux de Menuiserie',
  },
  {
    id: 'p10', title: 'أنابيب PVC 110mm', titleFr: 'Tuyaux PVC 110mm',
    description: 'أنابيب PVC للصرف الصحي بطول 4 متر', descriptionFr: 'Tuyaux PVC pour évacuation 4m',
    categoryId: 'plumbing-mat', price: 800, stock: 400, unit: 'piece', rating: 4.3, totalReviews: 9,
    merchantName: 'مؤسسة الكهرباء والأنوار', merchantNameFr: 'Electro Lumière',
    categoryName: 'مواد سباكة', categoryNameFr: 'Matériaux de Plomberie',
  },
  {
    id: 'p11', title: 'دهان جوتكس أبيض', titleFr: 'Peinture Joteks blanc',
    description: 'دهان جدران عالي الجودة - 20 كغ', descriptionFr: 'Peinture murale haute qualité - 20kg',
    categoryId: 'paint-mat', price: 4500, stock: 100, unit: 'bucket', rating: 4.5, totalReviews: 11,
    merchantName: 'مؤسسة البناء الحديث', merchantNameFr: 'Bati Modern',
    categoryName: 'دهانات وأدوات', categoryNameFr: 'Peintures et Outils',
  },
  {
    id: 'p12', title: 'طقم مفاتيح كريمة', titleFr: 'Jeu de clés à molette',
    description: 'طقم مفاتيح كريمة 8 قطع احترافي', descriptionFr: 'Jeu de clés à molette professionnel 8 pièces',
    categoryId: 'tools', price: 8500, stock: 30, unit: 'set', rating: 4.7, totalReviews: 4,
    merchantName: 'مؤسسة الكهرباء والأنوار', merchantNameFr: 'Electro Lumière',
    categoryName: 'أدوات يدوية', categoryNameFr: 'Outils à Main',
  },
];

// Equipment
export const equipmentList: EquipmentItem[] = [
  {
    id: 'e1', title: 'مكسارة خرسانة', titleFr: 'Concasseur de béton',
    description: 'مكسارة خرسانة قوية للهدم والحفر', descriptionFr: 'Concasseur de béton puissant pour démolition',
    dailyPrice: 25000, weeklyPrice: 150000, monthlyPrice: 500000,
    rating: 4.5, totalReviews: 8, ownerName: 'مؤسسة كراء المعدات الثقيلة', ownerNameFr: 'Location Matériel Lourd',
    status: 'AVAILABLE',
  },
  {
    id: 'e2', title: 'رافعة شوكية', titleFr: 'Chariot élévateur',
    description: 'رافعة شوكية كهربائية سعة 3 أطنان', descriptionFr: 'Chariot élévateur électrique 3 tonnes',
    dailyPrice: 15000, weeklyPrice: 90000, monthlyPrice: 300000,
    rating: 4.6, totalReviews: 12, ownerName: 'مؤسسة كراء المعدات الثقيلة', ownerNameFr: 'Location Matériel Lourd',
    status: 'AVAILABLE',
  },
  {
    id: 'e3', title: 'مضخة خرسانة', titleFr: 'Pompe à béton',
    description: 'مضخة خرسانة صناعية لصب الخرسانة', descriptionFr: 'Pompe à béton industrielle',
    dailyPrice: 35000, weeklyPrice: 200000, monthlyPrice: 700000,
    rating: 4.4, totalReviews: 6, ownerName: 'مؤسسة كراء المعدات الثقيلة', ownerNameFr: 'Location Matériel Lourd',
    status: 'AVAILABLE',
  },
  {
    id: 'e4', title: 'خلاطة خرسانة', titleFr: 'Bétonnière',
    description: 'خلاطة خرسانة 500 لتر للبناء', descriptionFr: 'Bétonnière 500L pour construction',
    dailyPrice: 8000, weeklyPrice: 45000, monthlyPrice: 150000,
    rating: 4.7, totalReviews: 15, ownerName: 'مؤسسة كراء المعدات الثقيلة', ownerNameFr: 'Location Matériel Lourd',
    status: 'AVAILABLE',
  },
  {
    id: 'e5', title: 'منشار كهربائي', titleFr: 'Scie électrique',
    description: 'منشار كهربائي احترافي لقطع الخشب والمعدن', descriptionFr: 'Scie électrique professionnelle pour bois et métal',
    dailyPrice: 3000, weeklyPrice: 18000, monthlyPrice: 60000,
    rating: 4.3, totalReviews: 10, ownerName: 'مؤسسة الأدوات المهنية', ownerNameFr: 'Outils Professionnels',
    status: 'AVAILABLE',
  },
  {
    id: 'e6', title: 'مثقاب كهربائي احترافي', titleFr: 'Perceuse professionnelle',
    description: 'مثقاب كهربائي بسرعات متعددة', descriptionFr: 'Perceuse électrique à vitesses multiples',
    dailyPrice: 2000, weeklyPrice: 12000, monthlyPrice: 40000,
    rating: 4.5, totalReviews: 7, ownerName: 'مؤسسة الأدوات المهنية', ownerNameFr: 'Outils Professionnels',
    status: 'AVAILABLE',
  },
  {
    id: 'e7', title: 'مكبس هوائي', titleFr: "Compresseur d'air",
    description: 'مكبس هوائي صناعي 50 لتر', descriptionFr: "Compresseur d'air industriel 50L",
    dailyPrice: 4000, weeklyPrice: 24000, monthlyPrice: 80000,
    rating: 4.6, totalReviews: 5, ownerName: 'مؤسسة الأدوات المهنية', ownerNameFr: 'Outils Professionnels',
    status: 'AVAILABLE',
  },
  {
    id: 'e8', title: 'سقالة معدنية', titleFr: 'Échafaudage métallique',
    description: 'سقالة معدنية للبناء والطلاء - مجموعة كاملة', descriptionFr: 'Échafaudage métallique complet',
    dailyPrice: 5000, weeklyPrice: 30000, monthlyPrice: 100000,
    rating: 4.4, totalReviews: 9, ownerName: 'مؤسسة الأدوات المهنية', ownerNameFr: 'Outils Professionnels',
    status: 'AVAILABLE',
  },
  {
    id: 'e9', title: 'جرافة صغيرة', titleFr: 'Mini pelleteuse',
    description: 'جرافة صغيرة متعددة الاستخدامات', descriptionFr: 'Mini pelleteuse polyvalente',
    dailyPrice: 30000, weeklyPrice: 180000, monthlyPrice: 600000,
    rating: 4.8, totalReviews: 11, ownerName: 'مؤسسة كراء المعدات الثقيلة', ownerNameFr: 'Location Matériel Lourd',
    status: 'AVAILABLE',
  },
  {
    id: 'e10', title: 'رشاش دهان هوائي', titleFr: 'Pistolet à peinture pneumatique',
    description: 'رشاش دهان احترافي للتشطيب', descriptionFr: 'Pistolet à peinture professionnel',
    dailyPrice: 2500, weeklyPrice: 15000, monthlyPrice: 50000,
    rating: 4.2, totalReviews: 4, ownerName: 'مؤسسة الأدوات المهنية', ownerNameFr: 'Outils Professionnels',
    status: 'AVAILABLE',
  },
];
