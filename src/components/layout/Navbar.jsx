import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, User, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@workos-inc/authkit-react';
import { cn } from '@/src/lib/cn';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user, isLoading, isAuthenticated, isAdmin } = useCurrentUser();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Projects', path: '/projects' },
  ];

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    await signOut();
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? 'N';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-[60px] w-full border-b border-border-subtle bg-[#0A0A0F]/85 backdrop-blur-[20px]"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-1">
            <span className="font-space text-xl font-bold tracking-wider text-text-primary">
              NE<span className="text-accent-cyan">X</span>US
            </span>
          </NavLink>
        </div>

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

        <div className="hidden md:flex md:items-center md:space-x-4">
          <button className="rounded-full p-2 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary">
            <Moon size={18} />
          </button>

          {isLoading ? (
            <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
          ) : isAuthenticated && user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-2 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-cyan/20 font-bold text-accent-cyan">
                  {userInitial}
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-text-secondary transition-transform',
                    isProfileMenuOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    key="profile-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full z-50 mt-3 min-w-[220px] rounded-xl border border-border-subtle bg-bg-card/95 p-2 shadow-2xl backdrop-blur-[18px]"
                  >
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate(`/profile/${user._id}`);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
                    >
                      <User size={16} />
                      <span>View Profile</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          navigate('/admin');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
                      >
                        <Shield size={16} />
                        <span>Admin Panel</span>
                      </button>
                    )}

                    <div className="my-2 border-t border-border-subtle" />

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/sign-in')}
              className="flex items-center gap-2 rounded-full bg-bg-surface px-4 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover border border-border-subtle"
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-text-secondary hover:text-text-primary"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

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
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate(`/profile/${user._id}`);
                      }}
                      className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/admin');
                        }}
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
                      >
                        <Shield size={20} />
                        <span>Admin</span>
                      </button>
                    )}
                    <button
                      onClick={() => void handleSignOut()}
                      className="flex items-center gap-2 text-red-300 hover:text-red-200"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/sign-in');
                    }}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
                  >
                    <User size={20} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
