import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, User } from 'lucide-react';
import { cn } from '@/src/lib/cn';

/**
 * Main navigation bar component
 */
export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-[60px] w-full border-b border-border-subtle bg-[#0A0A0F]/85 backdrop-blur-[20px]"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-1">
            <span className="font-space text-xl font-bold tracking-wider text-text-primary">
              NE<span className="text-accent-cyan">X</span>US
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-text-primary',
                    isActive
                      ? 'text-accent-cyan border-b border-accent-cyan pb-1'
                      : 'text-text-secondary'
                  )
                }
              >
                {link.name}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <button className="rounded-full p-2 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary">
            <Moon size={18} />
          </button>
          <button className="flex items-center gap-2 rounded-full bg-bg-surface px-4 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover border border-border-subtle">
            <User size={16} />
            <span>Sign In</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-text-secondary hover:text-text-primary"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border-subtle bg-bg-surface md:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-2 text-base font-medium',
                      isActive
                        ? 'bg-accent-cyan/10 text-accent-cyan'
                        : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="mt-4 flex items-center gap-4 px-3 py-2">
                <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
                  <Moon size={20} />
                  <span>Theme</span>
                </button>
                <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
                  <User size={20} />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
