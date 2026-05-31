'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Wrench, ShoppingBag, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
import SearchBar from './search-bar';
import CategoryGrid from './category-grid';
import ServiceCard from './service-card';
import ProductCard from './product-card';
import EquipmentCard from './equipment-card';
import { services, products, equipmentList, serviceCategories, productCategories } from '@/lib/data/mock';

const tabs = [
  { key: 'services' as const, icon: Wrench },
  { key: 'products' as const, icon: ShoppingBag },
  { key: 'equipment' as const, icon: Truck },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardScrollVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const ITEMS_PER_PAGE = 6;

export default function SectionSwitcher() {
  const { t, locale } = useI18n();
  const { activeSection, setActiveSection, searchQuery } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const tabLabels: Record<string, string> = {
    services: t.sections.services,
    products: t.sections.products,
    equipment: t.sections.equipment,
  };

  const sectionTitles: Record<string, string> = {
    services: t.services.title,
    products: t.products.title,
    equipment: t.equipment.title,
  };

  const sectionSubtitles: Record<string, string> = {
    services: t.services.subtitle,
    products: t.products.subtitle,
    equipment: t.equipment.subtitle,
  };

  // Search filtering
  const searchFilteredServices = useMemo(() => {
    const base = selectedCategory
      ? services.filter((s) => s.categoryId === selectedCategory)
      : services;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.trim().toLowerCase();
    return base.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.titleFr.toLowerCase().includes(q)
    );
  }, [selectedCategory, searchQuery]);

  const searchFilteredProducts = useMemo(() => {
    const base = selectedCategory
      ? products.filter((p) => p.categoryId === selectedCategory)
      : products;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.trim().toLowerCase();
    return base.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.titleFr.toLowerCase().includes(q)
    );
  }, [selectedCategory, searchQuery]);

  const searchFilteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) return equipmentList;
    const q = searchQuery.trim().toLowerCase();
    return equipmentList.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      e.titleFr.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Visible items (show more / show less)
  const visibleServices = showAll ? searchFilteredServices : searchFilteredServices.slice(0, ITEMS_PER_PAGE);
  const visibleProducts = showAll ? searchFilteredProducts : searchFilteredProducts.slice(0, ITEMS_PER_PAGE);
  const visibleEquipment = showAll ? searchFilteredEquipment : searchFilteredEquipment.slice(0, ITEMS_PER_PAGE);

  // Current item count
  const currentCount = activeSection === 'services' ? searchFilteredServices.length
    : activeSection === 'products' ? searchFilteredProducts.length
    : searchFilteredEquipment.length;

  const needsShowMore = activeSection === 'services' ? searchFilteredServices.length > ITEMS_PER_PAGE
    : activeSection === 'products' ? searchFilteredProducts.length > ITEMS_PER_PAGE
    : searchFilteredEquipment.length > ITEMS_PER_PAGE;

  const currentVisible = activeSection === 'services' ? visibleServices.length
    : activeSection === 'products' ? visibleProducts.length
    : visibleEquipment.length;

  // Reset show more when switching tabs or changing search
  const handleTabChange = (key: 'services' | 'products' | 'equipment') => {
    setActiveSection(key);
    setSelectedCategory(null);
    setShowAll(false);
  };

  const handleShowMore = () => setShowAll(true);
  const handleShowLess = () => setShowAll(false);

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50/50" id={`${activeSection}-section`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <SearchBar />

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-deal-navy mb-3">
            {sectionTitles[activeSection]}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {sectionSubtitles[activeSection]}
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-2 p-1.5 rounded-2xl bg-white shadow-lg border border-gray-100"
          >
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeSection === tab.key;
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-deal-orange text-white shadow-lg shadow-deal-orange/30'
                      : 'text-deal-navy hover:bg-gray-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="hidden sm:inline">{tabLabels[tab.key]}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Results count badge */}
        {searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deal-orange/5 border border-deal-orange/15">
              <div className="w-2 h-2 rounded-full bg-deal-orange animate-pulse" />
              <span className="text-sm font-semibold text-deal-navy">
                {currentCount} {t.footer.resultsCount}
              </span>
              {currentCount === 0 && (
                <span className="text-sm text-muted-foreground">— {t.common.noResults}</span>
              )}
            </div>
          </motion.div>
        )}

        {/* Content area */}
        <AnimatePresence mode="wait">
          {/* Services Tab */}
          {activeSection === 'services' && (
            <motion.div
              key="services"
              id="services-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              {!searchQuery.trim() && (
                <CategoryGrid
                  categories={serviceCategories}
                  activeCategory={selectedCategory}
                  onSelectCategory={(cat) => { setSelectedCategory(cat); setShowAll(false); }}
                  colorScheme="orange"
                />
              )}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {visibleServices.map((service, i) => (
                  <motion.div
                    key={service.id}
                    variants={cardScrollVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-30px' }}
                    style={{ y: parallaxY }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <ServiceCard service={service} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeSection === 'products' && (
            <motion.div
              key="products"
              id="products-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              {!searchQuery.trim() && (
                <CategoryGrid
                  categories={productCategories}
                  activeCategory={selectedCategory}
                  onSelectCategory={(cat) => { setSelectedCategory(cat); setShowAll(false); }}
                  colorScheme="teal"
                />
              )}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {visibleProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    variants={cardScrollVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-30px' }}
                    style={{ y: parallaxY }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Equipment Tab */}
          {activeSection === 'equipment' && (
            <motion.div
              key="equipment"
              id="equipment-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {visibleEquipment.map((eq, i) => (
                  <motion.div
                    key={eq.id}
                    variants={cardScrollVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-30px' }}
                    style={{ y: parallaxY }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <EquipmentCard equipment={eq} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show more / Show less button */}
        {needsShowMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={showAll ? handleShowLess : handleShowMore}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-deal-orange/20 text-deal-orange font-bold text-sm hover:border-deal-orange/40 hover:bg-deal-orange/5 transition-all shadow-md"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>{t.common.seeLess}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>{t.common.seeMore} ({currentCount - ITEMS_PER_PAGE}+)</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
