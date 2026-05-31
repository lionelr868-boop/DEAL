'use client';

import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/store';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function FAQSection() {
  const { t, locale } = useI18n();
  const faqItems = t.faq.items;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-teal-50/20 to-background" />
      <div className="absolute top-20 end-0 w-96 h-96 bg-deal-teal/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 start-0 w-80 h-80 bg-deal-orange/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="section-deco-line">
              <div className="dot bg-deal-teal" />
              <div className="dot bg-deal-orange" />
              <div className="dot bg-deal-gold" />
              <div className="dot bg-deal-teal" />
              <div className="line" />
            </div>
            <HelpCircle className="w-6 h-6 text-deal-teal section-sparkle" />
            <div className="section-deco-line">
              <div className="line" />
              <div className="dot bg-deal-teal" />
              <div className="dot bg-deal-gold" />
              <div className="dot bg-deal-orange" />
              <div className="dot bg-deal-teal" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-deal-navy mb-3 section-title-hover">
            {t.faq.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            {t.faq.subtitle}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="glass-card p-4 sm:p-6 space-y-0"
        >
          <Accordion type="single" collapsible className="space-y-0">
            {faqItems.map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <AccordionItem
                  value={`faq-${i}`}
                  className="faq-item border-b border-gray-100/80 last:border-b-0 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="text-deal-navy font-semibold text-sm sm:text-base hover:text-deal-orange hover:no-underline py-5 px-4 transition-colors duration-200 [&[data-state=open]>svg]:text-deal-orange group">
                    <span className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-deal-orange/10 to-deal-teal/10 flex items-center justify-center text-deal-orange text-xs font-black group-data-[state=open]:from-deal-orange group-data-[state=open]:to-deal-gold group-data-[state=open]:text-white transition-all duration-300">
                        {i + 1}
                      </span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-5 pt-0">
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-muted-foreground text-sm leading-relaxed ms-10"
                    >
                      {item.answer}
                    </motion.p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
