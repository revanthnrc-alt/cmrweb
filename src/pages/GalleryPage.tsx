import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Lightbox, Photo } from '../components/gallery/Lightbox';

// MOCK DATA
const MOCK_PHOTOS: Photo[] = Array.from({ length: 15 }).map((_, i) => {
  const categories = ['Events', 'Projects', 'Team'];
  const category = categories[i % 3];
  
  // Generate unique CSS gradients for placeholders
  const hue1 = (i * 37) % 360;
  const hue2 = (i * 73) % 360;
  const url = `linear-gradient(135deg, hsl(${hue1}, 70%, 20%), hsl(${hue2}, 80%, 30%))`;
  
  // Randomize heights for masonry effect
  const heights = ['h-64', 'h-80', 'h-96', 'h-[28rem]'];
  const heightClass = heights[i % 4];

  return {
    id: `photo-${i}`,
    url,
    caption: `${category} Highlight #${i + 1}`,
    photographer: ['Arjun S.', 'Priya M.', 'Rahul T.'][i % 3],
    date: new Date(Date.now() - i * 1000000000).toISOString(),
    category,
    heightClass // internal use for masonry
  };
});

export const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredPhotos = activeTab === 'All' 
    ? MOCK_PHOTOS 
    : MOCK_PHOTOS.filter(p => p.category === activeTab);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center space-y-4">
        <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary">Club Gallery</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">Moments captured during hackathons, meetups, and late-night coding sessions.</p>
      </div>

      <div className="flex justify-center mb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Events">Events</TabsTrigger>
            <TabsTrigger value="Projects">Projects</TabsTrigger>
            <TabsTrigger value="Team">Team</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setSelectedIndex(index)}
          >
            <div 
              className={`w-full ${(photo as any).heightClass} transition-transform duration-500 group-hover:scale-105`}
              style={{ background: photo.url }}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="font-space font-bold text-white text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{photo.caption}</h3>
              <div className="flex items-center gap-3 text-white/70 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <span className="flex items-center gap-1"><Camera size={14} /> {photo.photographer}</span>
                <span>{new Date(photo.date).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox 
        photo={selectedIndex !== null ? filteredPhotos[selectedIndex] : null}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};
