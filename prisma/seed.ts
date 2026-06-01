import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const hashPassword = (pw: string) => pw; // Simplified for MVP

async function seed() {
  // Clean existing data
  await db.review.deleteMany();
  await db.productOrder.deleteMany();
  await db.booking.deleteMany();
  await db.product.deleteMany();
  await db.equipment.deleteMany();
  await db.service.deleteMany();
  await db.productCategory.deleteMany();
  await db.serviceCategory.deleteMany();
  await db.user.deleteMany();

  // Create users
  const admin = await db.user.create({
    data: {
      email: 'admin@deal.dz',
      password: hashPassword('admin123'),
      name: 'إدارة DEAL',
      nameFr: 'Administration DEAL',
      role: 'ADMIN',
      phone: '0770000000',
      isVerified: true,
    },
  });

  const craftsman1 = await db.user.create({
    data: {
      email: 'karim@deal.dz',
      password: hashPassword('pass123'),
      name: 'كريم بن أحمد',
      nameFr: 'Karim Ben Ahmed',
      role: 'CRAFTSMAN',
      phone: '0771234567',
      bio: 'كهربائي محترف بخبرة 15 سنة في التركيب والصيانة الكهربائية',
      bioFr: 'Electricien professionnel avec 15 ans d\'expérience',
      specialties: '["electrical"]',
      experience: 15,
      hourlyRate: 2500,
      rating: 4.8,
      totalReviews: 42,
      isVerified: true,
    },
  });

  const craftsman2 = await db.user.create({
    data: {
      email: 'omar@deal.dz',
      password: hashPassword('pass123'),
      name: 'عمر بلقاسم',
      nameFr: 'Omar Belkacem',
      role: 'CRAFTSMAN',
      phone: '0779876543',
      bio: 'سباك متخصص في جميع أنواع التركيبات الصحية والصيانة',
      bioFr: 'Plombier spécialisé dans tous types d\'installations sanitaires',
      specialties: '["plumbing"]',
      experience: 10,
      hourlyRate: 2000,
      rating: 4.5,
      totalReviews: 28,
      isVerified: true,
    },
  });

  const craftsman3 = await db.user.create({
    data: {
      email: 'youcef@deal.dz',
      password: hashPassword('pass123'),
      name: 'يوسف مزياني',
      nameFr: 'Youcef Meziani',
      role: 'CRAFTSMAN',
      phone: '0773456789',
      bio: 'نجار محترف متخصص في الأثاث المخصص والديكور الخشبي',
      bioFr: 'Menuisier professionnel spécialisé dans le mobilier sur mesure',
      specialties: '["carpentry"]',
      experience: 12,
      hourlyRate: 3000,
      rating: 4.9,
      totalReviews: 35,
      isVerified: true,
    },
  });

  const craftsman4 = await db.user.create({
    data: {
      email: 'ali@deal.dz',
      password: hashPassword('pass123'),
      name: 'علي شريف',
      nameFr: 'Ali Cherif',
      role: 'CRAFTSMAN',
      phone: '0774567890',
      bio: 'فني تبريد وتكييف متخصص في جميع الأنواع',
      bioFr: 'Technicien en climatisation et réfrigération',
      specialties: '["hvac"]',
      experience: 8,
      hourlyRate: 2800,
      rating: 4.6,
      totalReviews: 19,
      isVerified: true,
    },
  });

  const craftsman5 = await db.user.create({
    data: {
      email: 'mohamed@deal.dz',
      password: hashPassword('pass123'),
      name: 'محمد بن عيسى',
      nameFr: 'Mohamed Ben Aissa',
      role: 'CRAFTSMAN',
      phone: '0775678901',
      bio: 'بناء وترميم - خبرة واسعة في البناء والديكور',
      bioFr: 'Construction et rénovation - vaste expérience en construction',
      specialties: '["construction"]',
      experience: 20,
      hourlyRate: 3500,
      rating: 4.7,
      totalReviews: 55,
      isVerified: true,
    },
  });

  const craftsman6 = await db.user.create({
    data: {
      email: 'salim@deal.dz',
      password: hashPassword('pass123'),
      name: 'سالم بوحمد',
      nameFr: 'Salim Bouhamed',
      role: 'CRAFTSMAN',
      phone: '0776789012',
      bio: 'حداد محترف - أبواب ونوافذ ألمنيوم وهياكل معدنية',
      bioFr: 'Ferronnier professionnel - portes et fenêtres aluminium',
      specialties: '["metalwork"]',
      experience: 14,
      hourlyRate: 2200,
      rating: 4.4,
      totalReviews: 22,
      isVerified: true,
    },
  });

  const merchant1 = await db.user.create({
    data: {
      email: 'bati@deal.dz',
      password: hashPassword('pass123'),
      name: 'مؤسسة البناء المModern',
      nameFr: 'Entreprise Bati Modern',
      role: 'MERCHANT',
      phone: '0771112233',
      shopName: 'مؤسسة البناء الحديث',
      shopNameFr: 'Bati Modern',
      bio: 'مؤسسة متخصصة في بيع مواد البناء والتجهيزات',
      bioFr: 'Spécialisé dans la vente de matériaux de construction',
      hasDelivery: true,
      rating: 4.3,
      totalReviews: 18,
      isVerified: true,
    },
  });

  const merchant2 = await db.user.create({
    data: {
      email: 'electro@deal.dz',
      password: hashPassword('pass123'),
      name: 'مؤسسة الكهرباء والأنوار',
      nameFr: 'Electro Lumière',
      role: 'MERCHANT',
      phone: '0772223344',
      shopName: 'مؤسسة الكهرباء والأنوار',
      shopNameFr: 'Electro Lumière',
      bio: 'أفضل أنواع الأسلاك والمعدات الكهربائية',
      bioFr: 'Meilleurs câbles et équipements électriques',
      hasDelivery: true,
      rating: 4.6,
      totalReviews: 25,
      isVerified: true,
    },
  });

  const merchant3 = await db.user.create({
    data: {
      email: 'bois@deal.dz',
      password: hashPassword('pass123'),
      name: 'مؤسسة الأخشاب الطبيعية',
      nameFr: 'Bois Nature',
      role: 'MERCHANT',
      phone: '0773334455',
      shopName: 'الأخشاب الطبيعية',
      shopNameFr: 'Bois Nature',
      bio: 'أخشاب طبيعية عالية الجودة لجميع أنواع الأعمال',
      bioFr: 'Bois naturel de haute qualité pour tous types de travaux',
      hasDelivery: true,
      rating: 4.1,
      totalReviews: 12,
      isVerified: true,
    },
  });

  const equipmentOwner1 = await db.user.create({
    data: {
      email: 'rent@deal.dz',
      password: hashPassword('pass123'),
      name: 'مؤسسة كراء المعدات الثقيلة',
      nameFr: 'Location Matériel Lourd',
      role: 'EQUIPMENT_OWNER',
      phone: '0774445566',
      bio: 'تأجير معدات بناء ثقيلة وخفيفة بأفضل الأسعار',
      bioFr: 'Location de matériel de construction lourd et léger aux meilleurs prix',
      rating: 4.5,
      totalReviews: 15,
      isVerified: true,
    },
  });

  const equipmentOwner2 = await db.user.create({
    data: {
      email: 'tools@deal.dz',
      password: hashPassword('pass123'),
      name: 'مؤسسة الأدوات المهنية',
      nameFr: 'Outils Professionnels',
      role: 'EQUIPMENT_OWNER',
      phone: '0775556677',
      bio: 'أدوات مهنية لجميع التخصصات - كراء يومي وأسبوعي',
      bioFr: 'Outils professionnels pour toutes spécialités - location journalière et hebdomadaire',
      rating: 4.2,
      totalReviews: 10,
      isVerified: true,
    },
  });

  const customer1 = await db.user.create({
    data: {
      email: 'ahmed@customer.dz',
      password: hashPassword('pass123'),
      name: 'أحمد مرابط',
      nameFr: 'Ahmed Merabet',
      role: 'CUSTOMER',
      phone: '0776667788',
    },
  });

  // Service Categories
  const elecCat = await db.serviceCategory.create({
    data: { name: 'كهرباء وإلكترونيات', nameFr: 'Électricité et Électronique', icon: 'Zap', sortOrder: 1 },
  });
  const plumbCat = await db.serviceCategory.create({
    data: { name: 'سباكة وتجهيزات صحية', nameFr: 'Plomberie et Sanitaires', icon: 'Droplets', sortOrder: 2 },
  });
  const buildCat = await db.serviceCategory.create({
    data: { name: 'بناء وترميم', nameFr: 'Construction et Rénovation', icon: 'HardHat', sortOrder: 3 },
  });
  const carpCat = await db.serviceCategory.create({
    data: { name: 'نجارة وأثاث', nameFr: 'Menuiserie et Meubles', icon: 'Hammer', sortOrder: 4 },
  });
  const hvacCat = await db.serviceCategory.create({
    data: { name: 'تبريد وتكييف', nameFr: 'Climatisation et Réfrigération', icon: 'Wind', sortOrder: 5 },
  });
  const metalCat = await db.serviceCategory.create({
    data: { name: 'حدادة وأشغال معدنية', nameFr: 'Ferronnerie et Travaux Métalliques', icon: 'Wrench', sortOrder: 6 },
  });
  const paintCat = await db.serviceCategory.create({
    data: { name: 'دهان وديكور', nameFr: 'Peinture et Décoration', icon: 'PaintBucket', sortOrder: 7 },
  });
  const cleanCat = await db.serviceCategory.create({
    data: { name: 'صيانة منزلية', nameFr: 'Entretien Ménager', icon: 'Home', sortOrder: 8 },
  });

  // Services
  await db.service.createMany({
    data: [
      {
        title: 'تركيب إنارة كاملة', titleFr: 'Installation électrique complète', description: 'تركيب كامل للإنارة المنزلية مع أسلاك ولمبات حديثة', descriptionFr: 'Installation complète de l\'éclairage domestique',
        categoryId: elecCat.id, providerId: craftsman1.id, price: 15000, rating: 4.8, totalReviews: 15, isAvailable: true,
      },
      {
        title: 'إصلاح أعطال كهربائية', titleFr: 'Réparation de pannes électriques', description: 'تشخيص وإصلاح جميع الأعطال الكهربائية المنزلية', descriptionFr: 'Diagnostic et réparation de toutes les pannes électriques',
        categoryId: elecCat.id, providerId: craftsman1.id, price: 3000, rating: 4.7, totalReviews: 27, isAvailable: true,
      },
      {
        title: 'توسيع شبكة كهربائية', titleFr: 'Extension de réseau électrique', description: 'توسيع وترقية الشبكة الكهربائية الحالية', descriptionFr: 'Extension et mise à niveau du réseau électrique existant',
        categoryId: elecCat.id, providerId: craftsman1.id, price: 20000, rating: 4.6, totalReviews: 8, isAvailable: true,
      },
      {
        title: 'إصلاح تسربات المياه', titleFr: 'Réparation de fuites d\'eau', description: 'كشف وإصلاح جميع أنواع التسربات المائية', descriptionFr: 'Détection et réparation de tous types de fuites d\'eau',
        categoryId: plumbCat.id, providerId: craftsman2.id, price: 4000, rating: 4.5, totalReviews: 20, isAvailable: true,
      },
      {
        title: 'تركيب سخان مياه', titleFr: 'Installation de chauffe-eau', description: 'تركيب وصيانة سخانات المياه بأنواعها', descriptionFr: 'Installation et entretien de chauffe-eau',
        categoryId: plumbCat.id, providerId: craftsman2.id, price: 8000, rating: 4.6, totalReviews: 12, isAvailable: true,
      },
      {
        title: 'تركيب حوض مطبخ', titleFr: 'Installation d\'évier de cuisine', description: 'تركيب وتوصيل أحواض المطبخ والحمام', descriptionFr: 'Installation et raccordement d\'éviers de cuisine et salle de bain',
        categoryId: plumbCat.id, providerId: craftsman2.id, price: 6000, rating: 4.4, totalReviews: 9, isAvailable: true,
      },
      {
        title: 'تصنيع أثاث مخصص', titleFr: 'Fabrication de meubles sur mesure', description: 'تصنيع أثاث خشبي حسب الطلب بأجود أنواع الأخشاب', descriptionFr: 'Fabrication de meubles en bois sur commande',
        categoryId: carpCat.id, providerId: craftsman3.id, price: 50000, rating: 4.9, totalReviews: 18, isAvailable: true,
      },
      {
        title: 'صيانة وتجديد الأثاث', titleFr: 'Restauration de meubles', description: 'تجديد وإصلاح الأثاث الخشبي القديم', descriptionFr: 'Rénovation et réparation de meubles anciens',
        categoryId: carpCat.id, providerId: craftsman3.id, price: 15000, rating: 4.8, totalReviews: 14, isAvailable: true,
      },
      {
        title: 'تركيب أثاث مطبخ', titleFr: 'Installation de cuisine', description: 'تركيب مطابخ كاملة مع خزائن وأرفف', descriptionFr: 'Installation de cuisines complètes',
        categoryId: carpCat.id, providerId: craftsman3.id, price: 35000, rating: 4.7, totalReviews: 10, isAvailable: true,
      },
      {
        title: 'تركيب وتصليح تكييف', titleFr: 'Installation et réparation de climatisation', description: 'تركيب وصيانة جميع أنواع المكيفات', descriptionFr: 'Installation et entretien de tous types de climatiseurs',
        categoryId: hvacCat.id, providerId: craftsman4.id, price: 12000, rating: 4.6, totalReviews: 16, isAvailable: true,
      },
      {
        title: 'صيانة دورية للتكييف', titleFr: 'Entretien périodique de climatisation', description: 'تنظيف وفحص وصيانة دورية لأجهزة التكييف', descriptionFr: 'Nettoyage, inspection et entretien périodique',
        categoryId: hvacCat.id, providerId: craftsman4.id, price: 5000, rating: 4.5, totalReviews: 22, isAvailable: true,
      },
      {
        title: 'ترميم شامل للمنزل', titleFr: 'Rénovation complète de maison', description: 'ترميم وتجديد كامل للمنازل والشقق', descriptionFr: 'Rénovation complète de maisons et appartements',
        categoryId: buildCat.id, providerId: craftsman5.id, price: 200000, rating: 4.8, totalReviews: 30, isAvailable: true,
      },
      {
        title: 'أعمال طلاء ودهان', titleFr: 'Travaux de peinture', description: 'دهان داخلي وخارجي بأفضل أنواع الطلاء', descriptionFr: 'Peinture intérieure et extérieure',
        categoryId: buildCat.id, providerId: craftsman5.id, price: 80000, rating: 4.6, totalReviews: 18, isAvailable: true,
      },
      {
        title: 'صيانة عامة للمنزل', titleFr: 'Entretien général de maison', description: 'خدمات صيانة شاملة للمنازل', descriptionFr: 'Services d\'entretien complet pour maisons',
        categoryId: cleanCat.id, providerId: craftsman5.id, price: 10000, rating: 4.5, totalReviews: 7, isAvailable: true,
      },
      {
        title: 'صناعة أبواب ألمنيوم', titleFr: 'Fabrication de portes en aluminium', description: 'تصنيع وتركيب أبواب ونوافذ ألمنيوم', descriptionFr: 'Fabrication et installation de portes et fenêtres en aluminium',
        categoryId: metalCat.id, providerId: craftsman6.id, price: 25000, rating: 4.4, totalReviews: 13, isAvailable: true,
      },
      {
        title: 'هياكل معدنية', titleFr: 'Structures métalliques', description: 'تصنيع هياكل معدنية وديكورات حديدية', descriptionFr: 'Fabrication de structures métalliques',
        categoryId: metalCat.id, providerId: craftsman6.id, price: 30000, rating: 4.5, totalReviews: 8, isAvailable: true,
      },
      {
        title: 'دهان داخلي احترافي', titleFr: 'Peinture intérieure professionnelle', description: 'دهان احترافي لجميع الغرف بتصاميم حديثة', descriptionFr: 'Peinture professionnelle pour toutes les pièces',
        categoryId: paintCat.id, providerId: craftsman6.id, price: 60000, rating: 4.7, totalReviews: 11, isAvailable: true,
      },
    ],
  });

  // Product Categories
  const cementCat = await db.productCategory.create({
    data: { name: 'مواد بناء', nameFr: 'Matériaux de Construction', icon: 'Brick', sortOrder: 1 },
  });
  const wireCat = await db.productCategory.create({
    data: { name: 'أسلاك ومعدات كهربائية', nameFr: 'Câbles et Équipements Électriques', icon: 'Cable', sortOrder: 2 },
  });
  const woodCat = await db.productCategory.create({
    data: { name: 'أخشاب ومواد نجارة', nameFr: 'Bois et Matériaux de Menuiserie', icon: 'TreePine', sortOrder: 3 },
  });
  const plumbingMatCat = await db.productCategory.create({
    data: { name: 'مواد سباكة', nameFr: 'Matériaux de Plomberie', icon: 'Pipette', sortOrder: 4 },
  });
  const paintMatCat = await db.productCategory.create({
    data: { name: 'دهانات وأدوات', nameFr: 'Peintures et Outils', icon: 'Palette', sortOrder: 5 },
  });
  const toolCat = await db.productCategory.create({
    data: { name: 'أدوات يدوية', nameFr: 'Outils à Main', icon: 'Screwdriver', sortOrder: 6 },
  });

  // Products
  await db.product.createMany({
    data: [
      {
        title: 'إسمنت GRE 42.5', titleFr: 'Ciment GRE 42.5', description: 'إسمنت عالي الجودة مناسب لجميع أعمال البناء', descriptionFr: 'Ciment haute qualité pour tous travaux de construction',
        categoryId: cementCat.id, merchantId: merchant1.id, price: 1200, stock: 500, unit: 'bag', rating: 4.5, totalReviews: 10, isAvailable: true,
      },
      {
        title: 'رمل خشن مغسول', titleFr: 'Sable lavé', description: 'رمل خشن مغسول مناسب لأعمال البناء والخرسانة', descriptionFr: 'Sable lavé pour construction et béton',
        categoryId: cementCat.id, merchantId: merchant1.id, price: 5000, stock: 200, unit: 'm3', rating: 4.3, totalReviews: 8, isAvailable: true,
      },
      {
        title: 'حديد تسليح 12mm', titleFr: 'Fer à béton 12mm', description: 'حديد تسليح بأطوال مختلفة', descriptionFr: 'Fer à béton de différentes longueurs',
        categoryId: cementCat.id, merchantId: merchant1.id, price: 800, stock: 1000, unit: 'bar', rating: 4.4, totalReviews: 6, isAvailable: true,
      },
      {
        title: 'طوب أحمر 12 ثقب', titleFr: 'Brique rouge 12 trous', description: 'طوب أحمر عالي الجودة 12 ثقب', descriptionFr: 'Brique rouge haute qualité 12 trous',
        categoryId: cementCat.id, merchantId: merchant1.id, price: 35, stock: 50000, unit: 'piece', rating: 4.2, totalReviews: 15, isAvailable: true,
      },
      {
        title: 'أسلاك كهربائية 2.5mm', titleFr: 'Câbles électriques 2.5mm', description: 'أسلاك نحاسية معزولة للتمديدات المنزلية', descriptionFr: 'Câbles en cuivre isolés pour installations domestiques',
        categoryId: wireCat.id, merchantId: merchant2.id, price: 4500, stock: 300, unit: 'roll', rating: 4.7, totalReviews: 12, isAvailable: true,
      },
      {
        title: 'لوحة كهربائية مقسمة', titleFr: 'Tableau électrique divisionnaire', description: 'لوحة كهربائية مقسمة بأحجام مختلفة', descriptionFr: 'Tableau électrique divisionnaire tailles variées',
        categoryId: wireCat.id, merchantId: merchant2.id, price: 15000, stock: 20, unit: 'piece', rating: 4.6, totalReviews: 8, isAvailable: true,
      },
      {
        title: 'ألمبيات LED 18 واط', titleFr: 'Ampoules LED 18W', description: 'إضاءة LED اقتصادية وعملية', descriptionFr: 'Éclairage LED économique',
        categoryId: wireCat.id, merchantId: merchant2.id, price: 350, stock: 500, unit: 'piece', rating: 4.8, totalReviews: 20, isAvailable: true,
      },
      {
        title: 'خشب زان أوروبي', titleFr: 'Hêtre européen', description: 'خشب زان أوروبي جاف ومشرب بجودة عالية', descriptionFr: 'Hêtre européen sec et traité haute qualité',
        categoryId: woodCat.id, merchantId: merchant3.id, price: 25000, stock: 50, unit: 'm3', rating: 4.6, totalReviews: 5, isAvailable: true,
      },
      {
        title: 'لوح MDF 18mm', titleFr: 'Panneau MDF 18mm', description: 'لوح MDF بأحجام مختلفة', descriptionFr: 'Panneau MDF tailles variées',
        categoryId: woodCat.id, merchantId: merchant3.id, price: 3500, stock: 200, unit: 'sheet', rating: 4.4, totalReviews: 7, isAvailable: true,
      },
      {
        title: 'أنابيب PVC 110mm', titleFr: 'Tuyaux PVC 110mm', description: 'أنابيب PVC للصرف الصحي بطول 4 متر', descriptionFr: 'Tuyaux PVC pour évacuation 4m',
        categoryId: plumbingMatCat.id, merchantId: merchant2.id, price: 800, stock: 400, unit: 'piece', rating: 4.3, totalReviews: 9, isAvailable: true,
      },
      {
        title: 'دهان جوتeks أبيض', titleFr: 'Peinture Joteks blanc', description: 'دهان جدران عالي الجودة - 20 كغ', descriptionFr: 'Peinture murale haute qualité - 20kg',
        categoryId: paintMatCat.id, merchantId: merchant1.id, price: 4500, stock: 100, unit: 'bucket', rating: 4.5, totalReviews: 11, isAvailable: true,
      },
      {
        title: 'طقم مفاتيح كريمة', titleFr: 'Jeu de clés à molette', description: 'طقم مفاتيح كريمة 8 قطع احترافي', descriptionFr: 'Jeu de clés à molette professionnel 8 pièces',
        categoryId: toolCat.id, merchantId: merchant2.id, price: 8500, stock: 30, unit: 'set', rating: 4.7, totalReviews: 4, isAvailable: true,
      },
    ],
  });

  // Equipment
  await db.equipment.createMany({
    data: [
      {
        title: 'مكسارة خرسانة', titleFr: 'Concasseur de béton', description: 'مكسارة خرسانة قوية للهدم والحفر', descriptionFr: 'Concasseur de béton puissant pour démolition',
        ownerId: equipmentOwner1.id, dailyPrice: 25000, weeklyPrice: 150000, monthlyPrice: 500000, status: 'AVAILABLE', rating: 4.5, totalReviews: 8,
      },
      {
        title: 'رافعة شوكية', titleFr: 'Chariot élévateur', description: 'رافعة شوكية كهربائية سعة 3 أطنان', descriptionFr: 'Chariot élévateur électrique 3 tonnes',
        ownerId: equipmentOwner1.id, dailyPrice: 15000, weeklyPrice: 90000, monthlyPrice: 300000, status: 'AVAILABLE', rating: 4.6, totalReviews: 12,
      },
      {
        title: 'مضخة خرسانة', titleFr: 'Pompe à béton', description: 'مضخة خرسانة صناعية لصب الخرسانة', descriptionFr: 'Pompe à béton industrielle',
        ownerId: equipmentOwner1.id, dailyPrice: 35000, weeklyPrice: 200000, monthlyPrice: 700000, status: 'AVAILABLE', rating: 4.4, totalReviews: 6,
      },
      {
        title: 'خلاطة خرسانة', titleFr: 'Bétonnière', description: 'خلاطة خرسانة 500 لتر للبناء', descriptionFr: 'Bétonnière 500L pour construction',
        ownerId: equipmentOwner1.id, dailyPrice: 8000, weeklyPrice: 45000, monthlyPrice: 150000, status: 'AVAILABLE', rating: 4.7, totalReviews: 15,
      },
      {
        title: 'منشار كهربائي', titleFr: 'Scie électrique', description: 'منشار كهربائي احترافي لقطع الخشب والمعدن', descriptionFr: 'Scie électrique professionnelle pour bois et métal',
        ownerId: equipmentOwner2.id, dailyPrice: 3000, weeklyPrice: 18000, monthlyPrice: 60000, status: 'AVAILABLE', rating: 4.3, totalReviews: 10,
      },
      {
        title: 'مثقاب كهربائي احترافي', titleFr: 'Perceuse professionnelle', description: 'مثقاب كهربائي بسرعات متعددة', descriptionFr: 'Perceuse électrique à vitesses multiples',
        ownerId: equipmentOwner2.id, dailyPrice: 2000, weeklyPrice: 12000, monthlyPrice: 40000, status: 'AVAILABLE', rating: 4.5, totalReviews: 7,
      },
      {
        title: 'مكبس هوائي', titleFr: 'Compresseur d\'air', description: 'مكبس هوائي صناعي 50 لتر', descriptionFr: 'Compresseur d\'air industriel 50L',
        ownerId: equipmentOwner2.id, dailyPrice: 4000, weeklyPrice: 24000, monthlyPrice: 80000, status: 'AVAILABLE', rating: 4.6, totalReviews: 5,
      },
      {
        title: 'سقالة معدنية', titleFr: 'Échafaudage métallique', description: 'سقالة معدنية للبناء والطلاء - مجموعة كاملة', descriptionFr: 'Échafaudage métallique complet',
        ownerId: equipmentOwner2.id, dailyPrice: 5000, weeklyPrice: 30000, monthlyPrice: 100000, status: 'AVAILABLE', rating: 4.4, totalReviews: 9,
      },
      {
        title: 'جرافة صغيرة', titleFr: 'Mini pelleteuse', description: 'جرافة صغيرة متعددة الاستخدامات', descriptionFr: 'Mini pelleteuse polyvalente',
        ownerId: equipmentOwner1.id, dailyPrice: 30000, weeklyPrice: 180000, monthlyPrice: 600000, status: 'AVAILABLE', rating: 4.8, totalReviews: 11,
      },
      {
        title: 'رشاش دهان هوائي', titleFr: 'Pistolet à peinture pneumatique', description: 'رشاش دهان احترافي للتشطيب', descriptionFr: 'Pistolet à peinture professionnel',
        ownerId: equipmentOwner2.id, dailyPrice: 2500, weeklyPrice: 15000, monthlyPrice: 50000, status: 'AVAILABLE', rating: 4.2, totalReviews: 4,
      },
    ],
  });

  // Reviews
  await db.review.createMany({
    data: [
      { authorId: customer1.id, targetId: craftsman1.id, targetType: 'user', rating: 5, comment: 'خدمة ممتازة وسريعة! أنصح الجميع بالتعامل معه', commentFr: 'Excellent service et rapide !' },
      { authorId: customer1.id, targetId: craftsman3.id, targetType: 'user', rating: 5, comment: 'أفضل نجار تعاملت معه. شغل نظيف واحترافي', commentFr: 'Meilleur menuisier ! Travail propre et professionnel' },
      { authorId: customer1.id, targetId: craftsman5.id, targetType: 'user', rating: 4, comment: 'عمل جيد ومتقن', commentFr: 'Bon travail soigné' },
    ],
  });

  console.log('✅ Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
