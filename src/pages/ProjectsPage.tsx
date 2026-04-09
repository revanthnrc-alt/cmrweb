import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { Filter, ChevronDown, Heart, Star } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/cn';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useToast } from '../components/ui/Toast';
import { api } from '../../convex/_generated/api';

const CATEGORIES = ['All', 'Web', 'AI/ML', 'Mobile', 'Other'];
type SortOption = 'Latest' | 'Most Liked' | 'Most Starred';

export const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState<Record<string, { liked: boolean; count: number }>>({});

  const projects = useQuery(api.projects.getAllProjects, {});
  const allUsers = useQuery(api.users.getAllUsers);
  const { user: currentUser } = useCurrentUser();
  const toggleLike = useMutation(api.projects.toggleLike);
  const { showToast } = useToast();

  const usersById = useMemo(() => new Map((allUsers ?? []).map((user) => [String(user._id), user])), [allUsers]);

  const filteredAndSortedProjects = useMemo(() => {
    const source = projects ?? [];
    const result = activeCategory === 'All'
      ? [...source]
      : source.filter((project) => project.category === activeCategory);

    result.sort((a, b) => {
      if (sortBy === 'Latest') return b.createdAt - a.createdAt;
      if (sortBy === 'Most Liked') return b.likes - a.likes;
      if (sortBy === 'Most Starred') return b.stars - a.stars;
      return 0;
    });

    return result;
  }, [activeCategory, projects, sortBy]);

  const handleLike = async (project: any) => {
    if (!currentUser) {
      showToast('Sign in to like projects', 'warning');
      return;
    }

    const current = localLikes[String(project._id)];
    const wasLiked = current?.liked ?? false;

    setLocalLikes((prev) => ({
      ...prev,
      [String(project._id)]: {
        liked: !wasLiked,
        count: (current?.count ?? project.likes) + (wasLiked ? -1 : 1),
      },
    }));

    try {
      await toggleLike({
        userId: currentUser._id,
        projectId: project._id,
      });
    } catch (err: any) {
      setLocalLikes((prev) => ({
        ...prev,
        [String(project._id)]: { liked: wasLiked, count: current?.count ?? project.likes },
      }));
      showToast(err?.message ?? 'Could not update like', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 space-y-4">
        <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary">Member Projects</h1>
        <p className="text-text-secondary text-lg max-w-2xl">Discover what the NexusClub community is building. From weekend hacks to production-ready startups.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-border-subtle">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                activeCategory === category
                  ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                  : 'bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            <Filter size={16} />
            Sort by: {sortBy}
            <ChevronDown size={16} className={cn('transition-transform', isSortOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                key="sort-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border-subtle rounded-md shadow-xl overflow-hidden z-50"
              >
                {(['Latest', 'Most Liked', 'Most Starred'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm transition-colors',
                      sortBy === option ? 'bg-accent-cyan/10 text-accent-cyan font-bold' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {projects === undefined || allUsers === undefined ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-white/5 rounded-lg h-24 break-inside-avoid" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProjects.map((project, index) => {
              const author = usersById.get(String(project.userId));
              const authorName = author?.name ?? 'Nexus Builder';
              const authorAvatar = authorName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
              const currentLike = localLikes[String(project._id)];
              const isLiked = currentLike?.liked ?? false;
              const likesCount = currentLike?.count ?? project.likes;
              const hue1 = (index * 45) % 360;
              const hue2 = (index * 85 + 40) % 360;
              const gradient = `linear-gradient(135deg, hsla(${hue1}, 80%, 20%, 0.5), hsla(${hue2}, 80%, 30%, 0.5))`;

              return (
                <motion.div
                  layout
                  key={String(project._id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid"
                >
                  <GlassCard hover className="overflow-hidden flex flex-col h-full group">
                    <div className="h-48 w-full relative overflow-hidden" style={{ background: gradient }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
                    </div>

                    <div className="p-6 flex flex-col flex-grow gap-4 -mt-12 relative z-10">
                      <div>
                        <h3 className="font-space font-bold text-2xl text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">{project.title}</h3>
                        <p className="text-text-secondary text-sm line-clamp-2">{project.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="gray">{tech}</Badge>
                        ))}
                        {project.techStack.length > 5 && (
                          <Badge variant="gray">+{project.techStack.length - 5}</Badge>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              void handleLike(project);
                            }}
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
                          <span className="text-xs font-medium text-text-secondary hidden sm:inline-block">{authorName}</span>
                          <div className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-[10px] font-bold border border-accent-cyan/30">
                            {authorAvatar}
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {projects !== undefined && filteredAndSortedProjects.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          No projects found for this category.
        </div>
      )}
    </div>
  );
};
