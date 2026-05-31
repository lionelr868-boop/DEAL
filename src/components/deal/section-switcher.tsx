'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ShoppingBag, Truck } from 'lucide-react';
import { useI18n, useAppStore } from '@/lib/store';
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

export default function SectionSwitcher() {
  const { t } = useI18n();
  const { activeSection, setActiveSection } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const filteredServices = selectedCategory
    ? services.filter((s) => s.categoryId === selectedCategory)
    : services;

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  const filteredEquipment = equipmentList;

  return (
    <section className="py-16 bg-gray-50/50" id={`${activeSection}-section`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  onClick={() => { setActiveSection(tab.key); setSelectedCategory(null); }}
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
              <CategoryGrid
                categories={serviceCategories}
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                colorScheme="orange"
              />
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredServices.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
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
              <CategoryGrid
                categories={productCategories}
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                colorScheme="teal"
              />
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
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
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredEquipment.map((eq, i) => (
                  <EquipmentCard key={eq.id} equipment={eq} index={i} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
