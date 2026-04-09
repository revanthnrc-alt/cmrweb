import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export interface Photo {
  id: string;
  url: string;
  caption: string;
  photographer: string;
  date: string;
  category: string;
}

interface LightboxProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ photo, isOpen, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-50"
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-6 p-4 text-white/50 hover:text-white transition-colors z-50"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-6 p-4 text-white/50 hover:text-white transition-colors z-50"
          >
            <ChevronRight size={48} />
          </button>

          {/* Content */}
          <div className="relative w-full max-w-5xl max-h-[80vh] flex flex-col items-center px-16" onClick={onClose}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Placeholder for actual image */}
              <div 
                className="w-full aspect-video rounded-lg shadow-2xl"
                style={{ background: photo.url }}
              />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-[-80px] left-0 right-0 text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-space text-2xl font-bold mb-2">{photo.caption}</h3>
              <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1"><Camera size={14} /> {photo.photographer}</span>
                <span>•</span>
                <span>{new Date(photo.date).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
