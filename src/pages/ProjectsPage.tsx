import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown } from 'lucide-react';
import { ProjectCard, Project } from '../components/projects/ProjectCard';
import { cn } from '../lib/cn';

// MOCK DATA
const MOCK_PROJECTS: Project[] = [
  { id: 'p1', title: 'Nexus AI Code Reviewer', description: 'An automated code review tool that integrates with GitHub PRs to provide AI-driven feedback.', tech: ['React', 'Python', 'OpenAI', 'FastAPI'], likes: 342, stars: 128, authorName: 'Arjun S.', authorAvatar: 'AS', category: 'AI/ML', date: '2026-04-01', index: 0 },
  { id: 'p2', title: 'Campus Event Tracker', description: 'Real-time event discovery and ticketing platform for college clubs.', tech: ['Next.js', 'Convex', 'Tailwind', 'Stripe'], likes: 215, stars: 84, authorName: 'Priya M.', authorAvatar: 'PM', category: 'Web', date: '2026-03-28', index: 1 },
  { id: 'p3', title: 'Decentralized Voting App', description: 'Secure and transparent student council elections using smart contracts.', tech: ['Solidity', 'React', 'Ethers.js', 'Hardhat'], likes: 450, stars: 256, authorName: 'Rahul T.', authorAvatar: 'RT', category: 'Web', date: '2026-03-15', index: 2 },
  { id: 'p4', title: 'StudySync Mobile', description: 'Cross-platform mobile app for collaborative study sessions and flashcards.', tech: ['Flutter', 'Firebase', 'Dart'], likes: 189, stars: 92, authorName: 'Kiran R.', authorAvatar: 'KR', category: 'Mobile', date: '2026-04-05', index: 3 },
  { id: 'p5', title: 'Auto-Grader CLI', description: 'Command-line tool for professors to automatically grade programming assignments.', tech: ['Go', 'Docker', 'Bash'], likes: 310, stars: 145, authorName: 'Vikram D.', authorAvatar: 'VD', category: 'DevOps', date: '2026-02-20', index: 4 },
  { id: 'p6', title: 'Neural Style Transfer App', description: 'Apply famous art styles to your photos using on-device machine learning.', tech: ['Swift', 'CoreML', 'Python'], likes: 275, stars: 110, authorName: 'Ananya K.', authorAvatar: 'AK', category: 'AI/ML', date: '2026-03-10', index: 5 },
  { id: 'p7', title: 'Club Management Dashboard', description: 'Internal tool for managing members, events, and finances.', tech: ['Vue.js', 'Node.js', 'PostgreSQL'], likes: 150, stars: 65, authorName: 'Sneha P.', authorAvatar: 'SP', category: 'Web', date: '2026-01-15', index: 6 },
  { id: 'p8', title: 'AR Campus Navigator', description: 'Augmented reality app to help freshmen find their classes.', tech: ['Unity', 'C#', 'ARCore'], likes: 420, stars: 198, authorName: 'Neha G.', authorAvatar: 'NG', category: 'Mobile', date: '2025-12-05', index: 7 },
];

const CATEGORIES = ['All', 'Web', 'AI/ML', 'Mobile', 'DevOps'];
type SortOption = 'Latest' | 'Most Liked' | 'Most Starred';

export const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Latest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredAndSortedProjects = useMemo(() => {
    let result = activeCategory === 'All' 
      ? [...MOCK_PROJECTS] 
      : MOCK_PROJECTS.filter(p => p.category === activeCategory);

    result.sort((a, b) => {
      if (sortBy === 'Latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'Most Liked') return b.likes - a.likes;
      if (sortBy === 'Most Starred') return b.stars - a.stars;
      return 0;
    });

    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 space-y-4">
        <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary">Member Projects</h1>
        <p className="text-text-secondary text-lg max-w-2xl">Discover what the NexusClub community is building. From weekend hacks to production-ready startups.</p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-border-subtle">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeCategory === cat 
                  ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted"
              )}
            >
              {cat}
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
            <ChevronDown size={16} className={cn("transition-transform", isSortOpen && "rotate-180")} />
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
                {(['Latest', 'Most Liked', 'Most Starred'] as SortOption[]).map(option => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      sortBy === option ? "bg-accent-cyan/10 text-accent-cyan font-bold" : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
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

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedProjects.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          No projects found for this category.
        </div>
      )}
    </div>
  );
};
