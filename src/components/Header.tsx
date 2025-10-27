
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Dumbbell, LineChart, Droplets, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/gym', icon: Dumbbell, label: 'Gym' },
    { path: '/insights', icon: LineChart, label: 'Insights' },
    { path: '/water', icon: Droplets, label: 'Water' },
    { path: '/nutrition', icon: UtensilsCrossed, label: 'Nutrition' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm dark:bg-background/80' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Flow</span>
        </Link>
        
        <div className="flex items-center">
          <ThemeToggle />
          
          <nav className="ml-4 flex space-x-1.5 sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center px-1.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors',
                  currentPath === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline mt-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
