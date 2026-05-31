import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const counts = {
      users: 0,
      serviceCategories: 0,
      productCategories: 0,
      services: 0,
      products: 0,
      equipment: 0,
      reviews: 0,
      bookings: 0,
      productOrders: 0,
      notifications: 0,
      messages: 0,
      complaints: 0,
    };

    // ─── USERS ────────────────────────────────────────────────
    const usersData = [
      {
        email: 'admin@deal.dz',
        password: 'admin123',
        role: 'ADMIN',
        name: 'مدير المنصة',
        nameFr: 'Administrateur DEAL',
      },
      {
        email: 'customer1@deal.dz',
        password: 'pass123',
        role: 'CUSTOMER',
        name: 'أحمد بن علي',
        nameFr: 'Ahmed Ben Ali',
        phone: '07XXXXXXXX',
      },
      {
        email: 'customer2@deal.dz',
        password: 'pass123',
        role: 'CUSTOMER',
        name: 'فاطمة الزهراء',
        nameFr: 'Fatima Zahra',
        phone: '07XXXXXXXX',
      },
      {
        email: 'craftsman1@deal.dz',
        password: 'pass123',
        role: 'CRAFTSMAN',
        name: 'محمد الكهربائي',
        nameFr: 'Mohamed Electricien',
        phone: '07XXXXXXXX',
        specialties: 'كهرباء, تمديدات',
        experience: 8,
        hourlyRate: 1500,
        rating: 4.5,
        totalReviews: 23,
        isVerified: true,
        bio: 'حرفي كهرباء محترف مع خبرة 8 سنوات في سوق أهراس',
        bioFr: 'Électricien professionnel avec 8 ans d\'expérience à Souk Ahras',
      },
      {
        email: 'craftsman2@deal.dz',
        password: 'pass123',
        role: 'CRAFTSMAN',
        name: 'كريم السباك',
        nameFr: 'Karim Plombier',
        phone: '07XXXXXXXX',
        specialties: 'سباكة, صيانة',
        experience: 12,
        hourlyRate: 1200,
        rating: 4.8,
        totalReviews: 45,
        isVerified: true,
        bio: 'سباك محترف متخصص في التركيب والصيانة',
        bioFr: 'Plombier professionnel spécialisé en installation et maintenance',
      },
      {
        email: 'merchant1@deal.dz',
        password: 'pass123',
        role: 'MERCHANT',
        name: 'سعيد للمواد',
        nameFr: 'Said Matériaux',
        phone: '07XXXXXXXX',
        shopName: 'محل سعيد للبناء',
        shopNameFr: 'Magasin Said BTP',
        hasDelivery: true,
        rating: 4.2,
        totalReviews: 18,
      },
      {
        email: 'merchant2@deal.dz',
        password: 'pass123',
        role: 'MERCHANT',
        name: 'الجمل للدهانات',
        nameFr: 'Gamal Peintures',
        phone: '07XXXXXXXX',
        shopName: 'محل الجمل',
        shopNameFr: 'Magasin Gamal',
        rating: 4.6,
        totalReviews: 31,
      },
      {
        email: 'equip1@deal.dz',
        password: 'pass123',
        role: 'EQUIPMENT_OWNER',
        name: 'رابح للمعدات',
        nameFr: 'Rabh Equipements',
        phone: '07XXXXXXXX',
        rating: 4.3,
        totalReviews: 15,
      },
    ];

    const createdUsers: Record<string, string> = {};
    for (const u of usersData) {
      const existing = await db.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        await db.user.create({ data: u });
        counts.users++;
      }
      // Get user id regardless
      const user = await db.user.findUnique({ where: { email: u.email }, select: { id: true } });
      if (user) {
        createdUsers[u.email] = user.id;
      }
    }

    // ─── SERVICE CATEGORIES ────────────────────────────────────
    const serviceCatData = [
      {
        name: 'كهرباء وإلكترونيات',
        nameFr: 'Électricité et Électronique',
        icon: '⚡',
        description: 'خدمات الكهرباء والتمديدات الكهربائية',
        descriptionFr: 'Services d\'électricité et d\'installations électriques',
        sortOrder: 1,
      },
      {
        name: 'سباكة',
        nameFr: 'Plomberie',
        icon: '🔧',
        description: 'خدمات السباكة والصيانة',
        descriptionFr: 'Services de plomberie et maintenance',
        sortOrder: 2,
      },
      {
        name: 'بناء وترميم',
        nameFr: 'Construction et Rénovation',
        icon: '🏗️',
        description: 'خدمات البناء والترميم',
        descriptionFr: 'Services de construction et rénovation',
        sortOrder: 3,
      },
      {
        name: 'نجارة',
        nameFr: 'Menuiserie',
        icon: '🪚',
        description: 'خدمات النجارة والأثاث',
        descriptionFr: 'Services de menuiserie et meubles',
        sortOrder: 4,
      },
      {
        name: 'دهان وديكور',
        nameFr: 'Peinture et Décoration',
        icon: '🎨',
        description: 'خدمات الدهان والديكور',
        descriptionFr: 'Services de peinture et décoration',
        sortOrder: 5,
      },
    ];

    const createdServiceCats: Record<string, string> = {};
    for (const cat of serviceCatData) {
      const existing = await db.serviceCategory.findFirst({ where: { name: cat.name } });
      if (!existing) {
        const created = await db.serviceCategory.create({ data: cat });
        counts.serviceCategories++;
        createdServiceCats[cat.name] = created.id;
      } else {
        createdServiceCats[cat.name] = existing.id;
      }
    }

    // ─── PRODUCT CATEGORIES ──────────────────────────────────
    const productCatData = [
      {
        name: 'مواد بناء',
        nameFr: 'Matériaux de construction',
        icon: '🧱',
        description: 'مواد البناء الأساسية',
        descriptionFr: 'Matériaux de construction de base',
        sortOrder: 1,
      },
      {
        name: 'أسلاك ومعدات كهربائية',
        nameFr: 'Câbles et équipements',
        icon: '🔌',
        description: 'الأسلاك والمعدات الكهربائية',
        descriptionFr: 'Câbles et équipements électriques',
        sortOrder: 2,
      },
      {
        name: 'دهانات',
        nameFr: 'Peintures',
        icon: '🎨',
        description: 'جميع أنواع الدهانات',
        descriptionFr: 'Tous types de peintures',
        sortOrder: 3,
      },
      {
        name: 'أخشاب',
        nameFr: 'Bois',
        icon: '🪵',
        description: 'الأخشاب والمواد الخشبية',
        descriptionFr: 'Bois et matériaux en bois',
        sortOrder: 4,
      },
      {
        name: 'أدوات',
        nameFr: 'Outils',
        icon: '🔧',
        description: 'أدوات البناء والإصلاح',
        descriptionFr: 'Outils de construction et réparation',
        sortOrder: 5,
      },
    ];

    const createdProductCats: Record<string, string> = {};
    for (const cat of productCatData) {
      const existing = await db.productCategory.findFirst({ where: { name: cat.name } });
      if (!existing) {
        const created = await db.productCategory.create({ data: cat });
        counts.productCategories++;
        createdProductCats[cat.name] = created.id;
      } else {
        createdProductCats[cat.name] = existing.id;
      }
    }

    // Helper: get first existing service by title to avoid duplicates
    async function findServiceByTitle(title: string) {
      return db.service.findFirst({ where: { title }, select: { id: true } });
    }

    async function findProductByTitle(title: string) {
      return db.product.findFirst({ where: { title }, select: { id: true } });
    }

    async function findEquipmentByTitle(title: string) {
      return db.equipment.findFirst({ where: { title }, select: { id: true } });
    }

    // ─── SERVICES ─────────────────────────────────────────────
    const servicesData = [
      {
        title: 'تمديدات كهربائية منزلية',
        titleFr: 'Installations électriques domestiques',
        description: 'تمديد الأسلاك الكهربائية للمنازل والشقق مع ضمان الجودة',
        descriptionFr: 'Installation de câblage électrique pour maisons et appartements avec garantie qualité',
        categoryId: createdServiceCats['كهرباء وإلكترونيات'],
        providerId: createdUsers['craftsman1@deal.dz'],
        price: 3000,
        priceUnit: 'service',
        rating: 4.5,
        totalReviews: 12,
        isAvailable: true,
      },
      {
        title: 'إصلاح أعطال كهربائية',
        titleFr: 'Réparation de pannes électriques',
        description: 'تشخيص وإصلاح جميع الأعطال الكهربائية بسرعة واحترافية',
        descriptionFr: 'Diagnostic et réparation de toutes les pannes électriques rapidement et professionnellement',
        categoryId: createdServiceCats['كهرباء وإلكترونيات'],
        providerId: createdUsers['craftsman1@deal.dz'],
        price: 2000,
        priceUnit: 'visit',
        rating: 4.2,
        totalReviews: 8,
        isAvailable: true,
      },
      {
        title: 'تركيب أنابيب المياه',
        titleFr: 'Installation de tuyauterie',
        description: 'تركيب شبكات المياه للمنازل الجديدة والقديمة',
        descriptionFr: 'Installation de réseaux d\'eau pour maisons neuves et anciennes',
        categoryId: createdServiceCats['سباكة'],
        providerId: createdUsers['craftsman2@deal.dz'],
        price: 3500,
        priceUnit: 'service',
        rating: 4.8,
        totalReviews: 20,
        isAvailable: true,
      },
      {
        title: 'صيانة مواسير الصرف',
        titleFr: 'Entretien des canalisations',
        description: 'تنظيف وإصلاح مواسير الصرف الصحي',
        descriptionFr: 'Nettoyage et réparation des canalisations d\'assainissement',
        categoryId: createdServiceCats['سباكة'],
        providerId: createdUsers['craftsman2@deal.dz'],
        price: 2500,
        priceUnit: 'visit',
        rating: 4.6,
        totalReviews: 15,
        isAvailable: true,
      },
      {
        title: 'بناء جدار استنادي',
        titleFr: 'Construction de mur de soutènement',
        description: 'بناء جدران استنادية للمباني والحدائق',
        descriptionFr: 'Construction de murs de soutènement pour bâtiments et jardins',
        categoryId: createdServiceCats['بناء وترميم'],
        providerId: createdUsers['craftsman2@deal.dz'],
        price: 50000,
        priceUnit: 'm2',
        rating: 4.0,
        totalReviews: 5,
        isAvailable: true,
      },
      {
        title: 'ترميم المباني القديمة',
        titleFr: 'Rénovation de bâtiments anciens',
        description: 'ترميم وإعادة تجديد المباني القديمة مع الحفاظ على الطابع المعماري',
        descriptionFr: 'Rénovation et remise à neuf de bâtiments anciens en préservant le caractère architectural',
        categoryId: createdServiceCats['بناء وترميم'],
        providerId: createdUsers['craftsman1@deal.dz'],
        price: 8000,
        priceUnit: 'm2',
        rating: 4.7,
        totalReviews: 10,
        isAvailable: true,
      },
      {
        title: 'صناعة أبواب ونوافذ خشبية',
        titleFr: 'Fabrication de portes et fenêtres en bois',
        description: 'تصنيع أبواب ونوافذ خشبية حسب الطلب بجودة عالية',
        descriptionFr: 'Fabrication de portes et fenêtres en bois sur mesure de haute qualité',
        categoryId: createdServiceCats['نجارة'],
        providerId: createdUsers['craftsman2@deal.dz'],
        price: 15000,
        priceUnit: 'unit',
        rating: 4.3,
        totalReviews: 7,
        isAvailable: true,
      },
      {
        title: 'دهان المنازل والشقق',
        titleFr: 'Peinture de maisons et appartements',
        description: 'دهان كامل للمنازل والشقق مع تجهيز الجدران',
        descriptionFr: 'Peinture complète de maisons et appartements avec préparation des murs',
        categoryId: createdServiceCats['دهان وديكور'],
        providerId: createdUsers['craftsman1@deal.dz'],
        price: 400,
        priceUnit: 'm2',
        rating: 4.4,
        totalReviews: 9,
        isAvailable: true,
      },
      {
        title: 'دهان ديكوري وإبداعي',
        titleFr: 'Peinture décorative et créative',
        description: 'تصميمات ديكورية بالدهان وتأثيرات خاصة للجدران',
        descriptionFr: 'Conceptions décoratives avec peinture et effets spéciaux pour murs',
        categoryId: createdServiceCats['دهان وديكور'],
        providerId: createdUsers['craftsman2@deal.dz'],
        price: 600,
        priceUnit: 'm2',
        rating: 4.9,
        totalReviews: 14,
        isAvailable: true,
      },
      {
        title: 'تركيب لوحة كهربائية',
        titleFr: 'Installation de tableau électrique',
        description: 'تركيب وتجهيز لوحات التوزيع الكهربائية',
        descriptionFr: 'Installation et équipement de tableaux de distribution électrique',
        categoryId: createdServiceCats['كهرباء وإلكترونيات'],
        providerId: createdUsers['craftsman1@deal.dz'],
        price: 5000,
        priceUnit: 'service',
        rating: 4.1,
        totalReviews: 6,
        isAvailable: true,
      },
      {
        title: 'صيانة التسريبات الخفيفة',
        titleFr: 'Réparation de fuites légères',
        description: 'إصلاح التسريبات الخفيفة في الحمامات والمطابخ',
        descriptionFr: 'Réparation de fuites légères dans salles de bain et cuisines',
        categoryId: createdServiceCats['سباكة'],
        providerId: createdUsers['craftsman2@deal.dz'],
        price: 1500,
        priceUnit: 'visit',
        rating: 4.5,
        totalReviews: 18,
        isAvailable: true,
      },
    ];

    const createdServices: string[] = [];
    for (const s of servicesData) {
      const existing = await findServiceByTitle(s.title);
      if (!existing) {
        const created = await db.service.create({ data: s });
        counts.services++;
        createdServices.push(created.id);
      }
    }

    // ─── PRODUCTS ─────────────────────────────────────────────
    const productsData = [
      {
        title: 'إسمنت بورتلاندي 50 كغ',
        titleFr: 'Ciment Portland 50 kg',
        description: 'إسمنت بورتلاندي عالي الجودة مناسب لجميع أعمال البناء',
        descriptionFr: 'Ciment Portland haute qualité pour tous les travaux de construction',
        categoryId: createdProductCats['مواد بناء'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 600,
        stock: 500,
        unit: 'bag',
        rating: 4.2,
        totalReviews: 8,
        isAvailable: true,
      },
      {
        title: 'رمل خشن للبناء',
        titleFr: 'Sable grossier pour construction',
        description: 'رمل خشن نظيف مناسب لخلطات الخرسانة والبناء',
        descriptionFr: 'Sable grossier propre adapté aux mélanges de béton et maçonnerie',
        categoryId: createdProductCats['مواد بناء'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 800,
        stock: 300,
        unit: 'm3',
        rating: 4.0,
        totalReviews: 4,
        isAvailable: true,
      },
      {
        title: 'طوب أحمر قياسي',
        titleFr: 'Brique rouge standard',
        description: 'طوب أحمر بحجم قياسي للجدران والقواطع',
        descriptionFr: 'Brique rouge de taille standard pour murs et cloisons',
        categoryId: createdProductCats['مواد بناء'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 18,
        stock: 10000,
        unit: 'piece',
        rating: 4.1,
        totalReviews: 6,
        isAvailable: true,
      },
      {
        title: 'دهان جوتن جلوس 20 لتر',
        titleFr: 'Peinture Jotun Gloss 20L',
        description: 'دهان جوتن عالي الجودة للجدران والأسقف',
        descriptionFr: 'Peinture Jotun haute qualité pour murs et plafonds',
        categoryId: createdProductCats['دهانات'],
        merchantId: createdUsers['merchant2@deal.dz'],
        price: 3500,
        stock: 100,
        unit: 'bucket',
        rating: 4.5,
        totalReviews: 12,
        isAvailable: true,
      },
      {
        title: 'دهان بلستيك أبيض 10 كغ',
        titleFr: 'Peinture plastique blanche 10 kg',
        description: 'دهان بلستيك أبيض للجدران الداخلية',
        descriptionFr: 'Peinture plastique blanche pour murs intérieurs',
        categoryId: createdProductCats['دهانات'],
        merchantId: createdUsers['merchant2@deal.dz'],
        price: 1800,
        stock: 150,
        unit: 'bucket',
        rating: 4.3,
        totalReviews: 9,
        isAvailable: true,
      },
      {
        title: 'سلك كهربائي 2.5 مم² × 100 م',
        titleFr: 'Câble électrique 2.5 mm² × 100 m',
        description: 'سلك نحاسي معزول للتمديدات الكهربائية المنزلية',
        descriptionFr: 'Câble en cuivre isolé pour installations électriques domestiques',
        categoryId: createdProductCats['أسلاك ومعدات كهربائية'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 4500,
        stock: 200,
        unit: 'roll',
        rating: 4.4,
        totalReviews: 11,
        isAvailable: true,
      },
      {
        title: 'لوحة مفاتيح كهربائية',
        titleFr: 'Tableau électrique',
        description: 'لوحة مفاتيح للتوزيع الكهربائي المنزلي',
        descriptionFr: 'Tableau de distribution électrique domestique',
        categoryId: createdProductCats['أسلاك ومعدات كهربائية'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 6500,
        stock: 50,
        unit: 'unit',
        rating: 4.2,
        totalReviews: 5,
        isAvailable: true,
      },
      {
        title: 'أبلكاش خشبي 122×244 سم',
        titleFr: 'Contreplaqué 122×244 cm',
        description: 'أبلكاش خشبي عالي الجودة للأثاث والأبواب',
        descriptionFr: 'Contreplaqué bois haute qualité pour meubles et portes',
        categoryId: createdProductCats['أخشاب'],
        merchantId: createdUsers['merchant2@deal.dz'],
        price: 2800,
        stock: 50,
        unit: 'sheet',
        rating: 4.6,
        totalReviews: 7,
        isAvailable: true,
      },
      {
        title: 'خشب زان مطحون',
        titleFr: 'Bois de hêtre raboté',
        description: 'خشب زان مطحون بجودة عالية للأعمال النجارية',
        descriptionFr: 'Bois de hêtre raboté de haute qualité pour la menuiserie',
        categoryId: createdProductCats['أخشاب'],
        merchantId: createdUsers['merchant2@deal.dz'],
        price: 3500,
        stock: 80,
        unit: 'm2',
        rating: 4.7,
        totalReviews: 4,
        isAvailable: true,
      },
      {
        title: 'طقم أدوات بناء احترافي',
        titleFr: 'Kit d\'outils de construction professionnels',
        description: 'طقم كامل من أدوات البناء يشمل مطرقة وشاكوش ومسطرة',
        descriptionFr: 'Kit complet d\'outils de construction incluant marteau, pioche et règle',
        categoryId: createdProductCats['أدوات'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 12000,
        stock: 30,
        unit: 'set',
        rating: 4.8,
        totalReviews: 15,
        isAvailable: true,
      },
      {
        title: 'مثقاب كهربائي يدوي',
        titleFr: 'Perceuse électrique',
        description: 'مثقاب كهربائي يدوي بقوة 500 واط مع ملحقات',
        descriptionFr: 'Perceuse électrique portable 500W avec accessoires',
        categoryId: createdProductCats['أدوات'],
        merchantId: createdUsers['merchant2@deal.dz'],
        price: 4500,
        stock: 40,
        unit: 'unit',
        rating: 4.4,
        totalReviews: 10,
        isAvailable: true,
      },
      {
        title: 'براغي وخواتم معدنية',
        titleFr: 'Vis et boulons en métal',
        description: 'مجموعة براغي وخواتم بأنواع وأحجام مختلفة',
        descriptionFr: 'Ensemble de vis et boulons de différents types et tailles',
        categoryId: createdProductCats['أدوات'],
        merchantId: createdUsers['merchant1@deal.dz'],
        price: 1500,
        stock: 100,
        unit: 'box',
        rating: 4.0,
        totalReviews: 3,
        isAvailable: true,
      },
    ];

    const createdProducts: string[] = [];
    for (const p of productsData) {
      const existing = await findProductByTitle(p.title);
      if (!existing) {
        const created = await db.product.create({ data: p });
        counts.products++;
        createdProducts.push(created.id);
      }
    }

    // ─── EQUIPMENT ────────────────────────────────────────────
    const equipmentData = [
      {
        title: 'خلاطة خرسانة',
        titleFr: 'Bétonnière',
        description: 'خلاطة خرسانة بقدرة 200 لتر تعمل بالبنزين',
        descriptionFr: 'Bétonnière de 200L à essence',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 5000,
        weeklyPrice: 25000,
        monthlyPrice: 80000,
        rating: 4.5,
        totalReviews: 8,
        status: 'AVAILABLE',
      },
      {
        title: 'حفارة صغيرة',
        titleFr: 'Mini excavatrice',
        description: 'حفارة صغيرة لأعمال الحفر والتنقيب',
        descriptionFr: 'Mini excavatrice pour travaux de fouille et excavation',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 35000,
        weeklyPrice: 175000,
        monthlyPrice: 500000,
        rating: 4.2,
        totalReviews: 4,
        status: 'AVAILABLE',
      },
      {
        title: 'سقالة معدنية',
        titleFr: 'Échafaudage métallique',
        description: 'مجموعة سقالة معدنية كاملة للبناء والطلاء',
        descriptionFr: 'Ensemble complet d\'échafaudage métallique pour construction et peinture',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 2000,
        weeklyPrice: 10000,
        monthlyPrice: 30000,
        rating: 4.3,
        totalReviews: 6,
        status: 'AVAILABLE',
      },
      {
        title: 'مولد كهربائي',
        titleFr: 'Groupe électrogène',
        description: 'مولد كهربائي بقدرة 5000 واط للورش والمنازل',
        descriptionFr: 'Groupe électrogène de 5000W pour chantiers et maisons',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 3000,
        weeklyPrice: 15000,
        monthlyPrice: 45000,
        rating: 4.6,
        totalReviews: 10,
        status: 'AVAILABLE',
      },
      {
        title: 'طقم مثقاب كهربائي',
        titleFr: 'Kit de perceuse électrique',
        description: 'طقم مثاقب كهربائية متنوعة للخرسانة والمعادن',
        descriptionFr: 'Kit de perceuses variées pour béton et métaux',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 500,
        weeklyPrice: 2500,
        monthlyPrice: 8000,
        rating: 4.1,
        totalReviews: 5,
        status: 'AVAILABLE',
      },
      {
        title: 'بخاخ دهان كهربائي',
        titleFr: 'Pistolet à peinture électrique',
        description: 'بخاخ دهان كهربائي احترافي للجدران والأسقف',
        descriptionFr: 'Pistolet à peinture électrique professionnel pour murs et plafonds',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 1500,
        weeklyPrice: 7500,
        monthlyPrice: 22000,
        rating: 4.4,
        totalReviews: 7,
        status: 'AVAILABLE',
      },
      {
        title: 'قاطعة خرسانة',
        titleFr: 'Coupe-béton',
        description: 'قاطعة خرسانة بالديزل لقطع الأرضيات والجدران',
        descriptionFr: 'Coupe-béton diesel pour découpe de sols et murs',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 4000,
        weeklyPrice: 20000,
        monthlyPrice: 60000,
        rating: 4.0,
        totalReviews: 3,
        status: 'AVAILABLE',
      },
      {
        title: 'رافعة يدوية',
        titleFr: 'Cric hydraulique',
        description: 'رافعة هيدروليكية يدوية سعة 5 طن',
        descriptionFr: 'Cric hydraulique manuel capacité 5 tonnes',
        ownerId: createdUsers['equip1@deal.dz'],
        dailyPrice: 800,
        weeklyPrice: 4000,
        monthlyPrice: 12000,
        rating: 4.2,
        totalReviews: 4,
        status: 'AVAILABLE',
      },
    ];

    const createdEquipment: string[] = [];
    for (const e of equipmentData) {
      const existing = await findEquipmentByTitle(e.title);
      if (!existing) {
        const created = await db.equipment.create({ data: e });
        counts.equipment++;
        createdEquipment.push(created.id);
      }
    }

    // ─── REVIEWS ──────────────────────────────────────────────
    const reviewsData = [
      {
        authorId: createdUsers['customer1@deal.dz'],
        targetId: createdUsers['craftsman1@deal.dz'],
        targetType: 'USER',
        rating: 5,
        comment: 'عمل ممتاز! محمد محترف جداً وأنهى العمل في الوقت المحدد',
        commentFr: 'Excellent travail! Mohamed est très professionnel et a terminé dans les délais',
      },
      {
        authorId: createdUsers['customer2@deal.dz'],
        targetId: createdUsers['craftsman1@deal.dz'],
        targetType: 'USER',
        rating: 4,
        comment: 'جودة العمل جيدة جداً، أنصح بالتعامل معه',
        commentFr: 'Très bonne qualité de travail, je le recommande',
      },
      {
        authorId: createdUsers['customer1@deal.dz'],
        targetId: createdUsers['craftsman2@deal.dz'],
        targetType: 'USER',
        rating: 5,
        comment: 'كريم أفضل سباك في المنطقة! سريع ومحترف',
        commentFr: 'Karim est le meilleur plombier de la région! Rapide et professionnel',
      },
      {
        authorId: createdUsers['customer2@deal.dz'],
        targetId: createdUsers['craftsman2@deal.dz'],
        targetType: 'USER',
        rating: 5,
        comment: 'خدمة رائعة وسعر معقول',
        commentFr: 'Service formidable et prix raisonnable',
      },
      {
        authorId: createdUsers['customer1@deal.dz'],
        targetId: createdUsers['merchant1@deal.dz'],
        targetType: 'USER',
        rating: 4,
        comment: 'محل سعيد يحتوي على كل ما تحتاجه للبناء',
        commentFr: 'Le magasin Said a tout ce dont vous avez besoin pour la construction',
      },
      {
        authorId: createdUsers['customer2@deal.dz'],
        targetId: createdUsers['merchant2@deal.dz'],
        targetType: 'USER',
        rating: 5,
        comment: 'أفضل دهانات في سوق أهراس بأسعار منافسة',
        commentFr: 'Meilleures peintures à Souk Ahras à des prix compétitifs',
      },
      {
        authorId: createdUsers['craftsman1@deal.dz'],
        targetId: createdUsers['merchant1@deal.dz'],
        targetType: 'USER',
        rating: 4,
        comment: 'مواد جيدة وأسعار معقولة للتوريد الدائم',
        commentFr: 'Bons matériaux et prix raisonnables pour l\'approvisionnement régulier',
      },
      {
        authorId: createdUsers['customer1@deal.dz'],
        targetId: createdUsers['equip1@deal.dz'],
        targetType: 'USER',
        rating: 4,
        comment: 'معدات نظيفة وجاهزة للعمل، خدمة التوصيل ممتازة',
        commentFr: 'Équipements propres et prêts à l\'emploi, service de livraison excellent',
      },
      {
        authorId: createdUsers['craftsman2@deal.dz'],
        targetId: createdUsers['equip1@deal.dz'],
        targetType: 'USER',
        rating: 5,
        comment: 'أجرة المعدات معقولة والحالة ممتازة',
        commentFr: 'Location d\'équipement à prix raisonnable et en excellent état',
      },
      {
        authorId: createdUsers['customer2@deal.dz'],
        targetId: createdUsers['merchant1@deal.dz'],
        targetType: 'USER',
        rating: 3,
        comment: 'خدمة جيدة لكن التوصيل تأخر قليلاً',
        commentFr: 'Bon service mais la livraison a été un peu retardée',
      },
      {
        authorId: createdUsers['customer1@deal.dz'],
        targetId: createdUsers['craftsman2@deal.dz'],
        targetType: 'USER',
        rating: 5,
        comment: 'سرعة الاستجابة وجودة الشغل رائعة',
        commentFr: 'Temps de réponse rapide et qualité de travail remarquable',
      },
      {
        authorId: createdUsers['customer2@deal.dz'],
        targetId: createdUsers['equip1@deal.dz'],
        targetType: 'USER',
        rating: 4,
        comment: 'خلاطة الخرسانة كانت في حالة جيدة جداً',
        commentFr: 'La bétonnière était en très bon état',
      },
    ];

    for (const r of reviewsData) {
      if (!r.authorId || !r.targetId) continue;
      const existing = await db.review.findFirst({
        where: {
          authorId: r.authorId,
          targetId: r.targetId,
          targetType: r.targetType,
          rating: r.rating,
        },
      });
      if (!existing) {
        await db.review.create({ data: r });
        counts.reviews++;
      }
    }

    // ─── BOOKINGS ─────────────────────────────────────────────
    // Get some service and equipment IDs for bookings
    const firstService = await db.service.findFirst({ select: { id: true, providerId: true } });
    const secondService = await db.service.findFirst({
      skip: 3,
      select: { id: true, providerId: true },
    });
    const firstEquipment = await db.equipment.findFirst({ select: { id: true, ownerId: true } });

    const bookingsData = [
      {
        customerId: createdUsers['customer1@deal.dz'],
        providerId: firstService?.providerId || createdUsers['craftsman1@deal.dz'],
        serviceId: firstService?.id,
        type: 'SERVICE',
        startDate: new Date('2025-01-15'),
        address: 'حي النصر، سوق أهراس',
        description: 'تركيب تمديدات كهربائية للشقة الجديدة',
        totalPrice: 3000,
        status: 'COMPLETED',
        notes: 'يرجى إحضار جميع المواد اللازمة',
      },
      {
        customerId: createdUsers['customer2@deal.dz'],
        providerId: secondService?.providerId || createdUsers['craftsman2@deal.dz'],
        serviceId: secondService?.id,
        type: 'SERVICE',
        startDate: new Date('2025-01-20'),
        address: 'شارع 1 نوفمبر، سوق أهراس',
        description: 'إصلاح تسريب في المطبخ',
        totalPrice: 1500,
        status: 'CONFIRMED',
        notes: 'التسريب من تحت الحوض',
      },
      {
        customerId: createdUsers['customer1@deal.dz'],
        providerId: firstEquipment?.ownerId || createdUsers['equip1@deal.dz'],
        equipmentId: firstEquipment?.id,
        type: 'EQUIPMENT',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-08'),
        totalPrice: 25000,
        status: 'COMPLETED',
        notes: 'تأجير لمدة أسبوع لمشروع بناء',
      },
      {
        customerId: createdUsers['customer2@deal.dz'],
        providerId: firstService?.providerId || createdUsers['craftsman1@deal.dz'],
        serviceId: firstService?.id,
        type: 'SERVICE',
        startDate: new Date('2025-02-10'),
        address: 'حي 20 أوت، سوق أهراس',
        description: 'دهان غرفتين في المنزل',
        totalPrice: 16000,
        status: 'IN_PROGRESS',
      },
      {
        customerId: createdUsers['customer1@deal.dz'],
        providerId: firstEquipment?.ownerId || createdUsers['equip1@deal.dz'],
        equipmentId: firstEquipment?.id,
        type: 'EQUIPMENT',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-02'),
        totalPrice: 5000,
        status: 'PENDING',
        notes: 'خلاطة خرسانة ليوم واحد',
      },
    ];

    for (const b of bookingsData) {
      if (!b.customerId || !b.providerId) continue;
      // Check if similar booking exists to avoid duplicates
      const existing = await db.booking.findFirst({
        where: {
          customerId: b.customerId,
          providerId: b.providerId,
          totalPrice: b.totalPrice,
          type: b.type,
        },
      });
      if (!existing) {
        await db.booking.create({ data: b as never });
        counts.bookings++;
      }
    }

    // ─── PRODUCT ORDERS ────────────────────────────────────────
    const firstProduct = await db.product.findFirst({ select: { id: true, merchantId: true, price: true } });
    const secondProduct = await db.product.findFirst({ skip: 3, select: { id: true, merchantId: true, price: true } });
    const thirdProduct = await db.product.findFirst({ skip: 5, select: { id: true, merchantId: true, price: true } });

    const ordersData = [
      {
        customerId: createdUsers['customer1@deal.dz'],
        merchantId: firstProduct?.merchantId || createdUsers['merchant1@deal.dz'],
        productId: firstProduct?.id,
        quantity: 10,
        totalPrice: (firstProduct?.price || 600) * 10,
        status: 'DELIVERED',
        deliveryAddress: 'حي النصر، سوق أهراس',
        notes: 'يرجى التوصيل صباحاً',
      },
      {
        customerId: createdUsers['customer2@deal.dz'],
        merchantId: secondProduct?.merchantId || createdUsers['merchant2@deal.dz'],
        productId: secondProduct?.id,
        quantity: 2,
        totalPrice: (secondProduct?.price || 3500) * 2,
        status: 'CONFIRMED',
        deliveryAddress: 'شارع الاستقلال، سوق أهراس',
      },
      {
        customerId: createdUsers['customer1@deal.dz'],
        merchantId: firstProduct?.merchantId || createdUsers['merchant1@deal.dz'],
        productId: thirdProduct?.id,
        quantity: 5,
        totalPrice: (thirdProduct?.price || 4500) * 5,
        status: 'PENDING',
        deliveryAddress: 'حي 20 أوت، سوق أهراس',
      },
      {
        customerId: createdUsers['customer2@deal.dz'],
        merchantId: firstProduct?.merchantId || createdUsers['merchant1@deal.dz'],
        productId: firstProduct?.id,
        quantity: 20,
        totalPrice: (firstProduct?.price || 600) * 20,
        status: 'COMPLETED',
        deliveryAddress: 'شارع 1 نوفمبر، سوق أهراس',
        notes: 'طلب كبير - يرجى التأكيد قبل التوصيل',
      },
      {
        customerId: createdUsers['craftsman1@deal.dz'],
        merchantId: thirdProduct?.merchantId || createdUsers['merchant2@deal.dz'],
        productId: thirdProduct?.id,
        quantity: 3,
        totalPrice: (thirdProduct?.price || 4500) * 3,
        status: 'COMPLETED',
        deliveryAddress: 'حي النصر، سوق أهراس',
        notes: 'للمشروع الحالي',
      },
    ];

    for (const o of ordersData) {
      if (!o.customerId || !o.merchantId || !o.productId) continue;
      const existing = await db.productOrder.findFirst({
        where: {
          customerId: o.customerId,
          merchantId: o.merchantId,
          productId: o.productId,
          quantity: o.quantity,
        },
      });
      if (!existing) {
        await db.productOrder.create({ data: o as never });
        counts.productOrders++;
      }
    }

    // ─── NOTIFICATIONS ───────────────────────────────────────
    const notificationsData = [
      {
        userId: createdUsers['admin@deal.dz'],
        type: 'system',
        title: 'مرحباً بك في DEAL',
        titleFr: 'Bienvenue sur DEAL',
        message: 'تم تفعيل حساب المدير بنجاح',
        messageFr: 'Le compte administrateur a été activé avec succès',
      },
      {
        userId: createdUsers['admin@deal.dz'],
        type: 'booking',
        title: 'حجز جديد',
        titleFr: 'Nouvelle réservation',
        message: 'تم استلام حجز جديد لخدمة كهربائية',
        messageFr: 'Une nouvelle réservation de service électrique a été reçue',
      },
      {
        userId: createdUsers['customer1@deal.dz'],
        type: 'booking',
        title: 'تم تأكيد حجزك',
        titleFr: 'Votre réservation est confirmée',
        message: 'تم تأكيد حجز خدمة التمديدات الكهربائية',
        messageFr: 'La réservation du service d\'installation électrique est confirmée',
      },
      {
        userId: createdUsers['craftsman1@deal.dz'],
        type: 'review',
        title: 'تقييم جديد',
        titleFr: 'Nouvel avis',
        message: 'حصلت على تقييم 5 نجوم من أحمد بن علي',
        messageFr: 'Vous avez reçu un avis de 5 étoiles de Ahmed Ben Ali',
      },
      {
        userId: createdUsers['customer2@deal.dz'],
        type: 'order',
        title: 'شحنتك في الطريق',
        titleFr: 'Votre commande est en route',
        message: 'طلب الدهانات تم شحنه وسيصلك غداً',
        messageFr: 'Votre commande de peintures a été expédiée et arrivera demain',
      },
      {
        userId: createdUsers['merchant1@deal.dz'],
        type: 'order',
        title: 'طلب جديد',
        titleFr: 'Nouvelle commande',
        message: 'طلب جديد من فاطمة الزهراء - 20 كيس إسمنت',
        messageFr: 'Nouvelle commande de Fatima Zahra - 20 sacs de ciment',
      },
      {
        userId: createdUsers['equip1@deal.dz'],
        type: 'booking',
        title: 'طلب تأجير جديد',
        titleFr: 'Nouvelle demande de location',
        message: 'طلب تأجير خلاطة خرسانة لمدة أسبوع',
        messageFr: 'Demande de location de bétonnière pour une semaine',
      },
    ];

    for (const n of notificationsData) {
      if (!n.userId) continue;
      const existing = await db.notificationDb.findFirst({
        where: {
          userId: n.userId,
          type: n.type,
          title: n.title,
        },
      });
      if (!existing) {
        await db.notificationDb.create({ data: n });
        counts.notifications++;
      }
    }

    // ─── MESSAGES ─────────────────────────────────────────────
    const messagesData = [
      {
        senderId: createdUsers['customer1@deal.dz'],
        receiverId: createdUsers['craftsman1@deal.dz'],
        content: 'مرحباً، أريد حجز موعد للتمديدات الكهربائية',
        isRead: true,
      },
      {
        senderId: createdUsers['craftsman1@deal.dz'],
        receiverId: createdUsers['customer1@deal.dz'],
        content: 'أهلاً أحمد! متى تريد أن أزورك؟',
        isRead: true,
      },
      {
        senderId: createdUsers['customer1@deal.dz'],
        receiverId: createdUsers['craftsman1@deal.dz'],
        content: 'الأربعاء القادم إن شاء الله، هل الوقت مناسب؟',
        isRead: true,
      },
      {
        senderId: createdUsers['craftsman1@deal.dz'],
        receiverId: createdUsers['customer1@deal.dz'],
        content: 'نعم، سأكون عندك الساعة 9 صباحاً',
        isRead: false,
      },
      {
        senderId: createdUsers['customer2@deal.dz'],
        receiverId: createdUsers['craftsman2@deal.dz'],
        content: 'السلام عليكم، عندي مشكلة تسريب مياه',
        isRead: true,
      },
      {
        senderId: createdUsers['craftsman2@deal.dz'],
        receiverId: createdUsers['customer2@deal.dz'],
        content: 'وعليكم السلام، هل التسريب من الحمام أم المطبخ؟',
        isRead: true,
      },
      {
        senderId: createdUsers['customer2@deal.dz'],
        receiverId: createdUsers['craftsman2@deal.dz'],
        content: 'من المطبخ، تحت الحوض مباشرة',
        isRead: true,
      },
      {
        senderId: createdUsers['craftsman2@deal.dz'],
        receiverId: createdUsers['customer2@deal.dz'],
        content: 'حسناً، يمكنني المجيء غداً الساعة 10 صباحاً',
        isRead: false,
      },
      {
        senderId: createdUsers['customer1@deal.dz'],
        receiverId: createdUsers['merchant1@deal.dz'],
        content: 'كم سعر الإسمنت حالياً؟',
        isRead: true,
      },
      {
        senderId: createdUsers['merchant1@deal.dz'],
        receiverId: createdUsers['customer1@deal.dz'],
        content: '600 دج للكيس الواحد، ولو تاخد أكثر من 50 كيس عندك خصم',
        isRead: true,
      },
    ];

    for (const m of messagesData) {
      if (!m.senderId || !m.receiverId) continue;
      const existing = await db.message.findFirst({
        where: {
          senderId: m.senderId,
          receiverId: m.receiverId,
          content: m.content,
        },
      });
      if (!existing) {
        await db.message.create({ data: m });
        counts.messages++;
      }
    }

    // ─── COMPLAINTS ───────────────────────────────────────────
    const complaintsData = [
      {
        userId: createdUsers['customer1@deal.dz'],
        targetId: createdUsers['merchant1@deal.dz'],
        targetType: 'MERCHANT',
        subject: 'تأخر في التوصيل',
        subjectFr: 'Retard de livraison',
        description: 'طلبت مواد بناء قبل أسبوع ولم تصل بعد',
        descriptionFr: 'J\'ai commandé des matériaux de construction il y a une semaine et ils ne sont toujours pas arrivés',
        status: 'IN_PROGRESS',
        adminReply: 'سيتم التواصل مع التاجر فوراً',
        adminReplyFr: 'Nous allons contacter le marchand immédiatement',
      },
      {
        userId: createdUsers['customer2@deal.dz'],
        subject: 'مشكلة في الموقع',
        subjectFr: 'Problème avec le site',
        description: 'لا أستطيع إكمال عملية الدفع',
        descriptionFr: 'Je ne peux pas terminer le processus de paiement',
        status: 'RESOLVED',
        adminReply: 'تم إصلاح المشكلة. يرجى المحاولة مرة أخرى',
        adminReplyFr: 'Le problème a été résolu. Veuillez réessayer',
      },
      {
        userId: createdUsers['craftsman1@deal.dz'],
        subject: 'اقتراح لتحسين المنصة',
        subjectFr: 'Suggestion pour améliorer la plateforme',
        description: 'أقترح إضافة خاصية تقويم الحجوزات',
        descriptionFr: 'Je suggère d\'ajouter une fonctionnalité de calendrier de réservations',
        status: 'PENDING',
      },
    ];

    for (const c of complaintsData) {
      if (!c.userId) continue;
      const existing = await db.complaint.findFirst({
        where: {
          userId: c.userId,
          subject: c.subject,
        },
      });
      if (!existing) {
        await db.complaint.create({ data: c as never });
        counts.complaints++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم تهيئة قاعدة البيانات بنجاح / Base de données initialisée avec succès',
      counts,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error during seeding', details: String(error) },
      { status: 500 }
    );
  }
}
