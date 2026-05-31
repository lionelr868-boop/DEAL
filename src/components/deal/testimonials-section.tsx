'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircleHeart } from 'lucide-react';
import { useI18n } from '@/lib/store';

const avatarColors = [
  'from-deal-orange to-deal-gold',
  'from-deal-teal to-deal-teal-light',
  'from-deal-gold to-amber-400',
  'from-deal-orange to-deal-teal',
  'from-deal-teal to-deal-gold',
  'from-deal-orange-light to-deal-orange',
];

const ratings = [5, 4, 5, 5, 4, 5];

export default function TestimonialsSection() {
  const { t, locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonials = t.testimonials.testimonials;
  const total = testimonials.length;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex((idx + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(currentIndex + 1, 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1, -1), [currentIndex, goTo]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((i) => (i + 1) % total);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, total]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const current = testimonials[currentIndex];

  return (
    <section
      className="relative py-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-50/30 to-background" />
      <div className="absolute top-0 start-0 w-72 h-72 bg-deal-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 end-0 w-72 h-72 bg-deal-teal/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="dot bg-deal-orange" />
              <div className="dot bg-deal-gold" />
              <div className="dot bg-deal-teal" />
              <div className="dot bg-deal-orange" />
              <div className="line" />
            </div>
            <MessageCircleHeart className="w-6 h-6 text-deal-orange section-sparkle" />
            <div className="section-deco-line">
              <div className="line" />
              <div className="dot bg-deal-orange" />
              <div className="dot bg-deal-teal" />
              <div className="dot bg-deal-gold" />
              <div className="dot bg-deal-orange" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-deal-navy mb-3 section-title-hover">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute -start-2 sm:-start-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-deal-orange hover:text-white hover:border-deal-orange transition-all duration-300 hover:scale-110 hover:shadow-xl hover-lift"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute -end-2 sm:-end-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-deal-orange hover:text-white hover:border-deal-orange transition-all duration-300 hover:scale-110 hover:shadow-xl hover-lift"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Card */}
          <div className="mx-4 sm:mx-12 lg:mx-16">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="testimonial-card glass-card p-8 sm:p-10"
              >
                {/* Quote icon */}
                <div className="absolute top-6 end-8 opacity-10">
                  <Quote className="w-12 h-12 text-deal-orange" />
                </div>

                <div className="flex flex-col items-center text-center gap-5">
                  {/* Avatar */}
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColors[currentIndex]} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-xl font-black text-white">
                      {current.name.charAt(0)}
                    </span>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="font-bold text-deal-navy text-lg">{current.name}</h3>
                    <p className="text-deal-orange text-sm font-semibold mt-0.5">{current.role}</p>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < ratings[currentIndex]
                            ? 'text-deal-gold fill-deal-gold'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-deal-navy/80 text-sm sm:text-base leading-relaxed max-w-xl">
                    &ldquo;{current.text}&rdquo;
                  </p>

                  {/* Date */}
                  <p className="text-muted-foreground text-xs font-medium">{current.date}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
                className={`carousel-dot rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 h-3 bg-deal-orange shadow-md shadow-deal-orange/30'
                    : 'w-3 h-3 bg-gray-300 hover:bg-deal-orange/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
