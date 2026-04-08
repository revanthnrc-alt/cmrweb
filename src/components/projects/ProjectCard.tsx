import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { cn } from '@/src/lib/cn';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  likes: number;
  stars: number;
  authorName: string;
  authorAvatar: string;
  category: string;
  date: string;
  index: number;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Generate unique gradient based on index
  const hue1 = (project.index * 45) % 360;
  const hue2 = (project.index * 85 + 40) % 360;
  const gradient = `linear-gradient(135deg, hsla(${hue1}, 80%, 20%, 0.5), hsla(${hue2}, 80%, 30%, 0.5))`;

  return (
    <GlassCard hover className="overflow-hidden flex flex-col h-full group">
      {/* Cover Image Placeholder */}
      <div 
        className="h-48 w-full relative overflow-hidden"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow gap-4 -mt-12 relative z-10">
        <div>
          <h3 className="font-space font-bold text-2xl text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">{project.title}</h3>
          <p className="text-text-secondary text-sm line-clamp-2">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {project.tech.slice(0, 5).map(t => (
            <Badge key={t} variant="gray">{t}</Badge>
          ))}
          {project.tech.length > 5 && (
            <Badge variant="gray">+{project.tech.length - 5}</Badge>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-auto pt-4 border-t border-border-subtle flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-400"
              style={{ color: isLiked ? '#ef4444' : 'var(--text-muted)' }}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </motion.div>
              {likesCount}
            </button>
            <div className="flex items-center gap-1.5 text-sm font-medium text-text-muted">
              <Star size={16} /> {project.stars}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-secondary hidden sm:inline-block">{project.authorName}</span>
            <div className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-[10px] font-bold border border-accent-cyan/30">
              {project.authorAvatar}
            </div>
          </div>
        </div>

        {/* View Link Overlay (appears on hover) */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </div>
    </GlassCard>
  );
};
