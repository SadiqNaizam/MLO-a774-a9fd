import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { Input }
from '@/components/ui/input';
// import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"; // Example if using shadcn nav menu

interface SiteNavigationMenuProps {
  cartItemCount?: number;
  siteTitle?: string;
}

const SiteNavigationMenu: React.FC<SiteNavigationMenuProps> = ({ cartItemCount = 0, siteTitle = "MyApp" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("Rendering SiteNavigationMenu, cart items:", cartItemCount);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-background border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Title */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              {siteTitle}
            </Link>
          </div>

          {/* Desktop Navigation Links & Search */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Optional: shadcn/ui NavigationMenu for complex dropdowns */}
            {/* <NavigationMenu> <NavigationMenuList> ... </NavigationMenuList> </NavigationMenu> */}
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <Input type="search" placeholder="Search..." className="pl-8 h-9 w-40 lg:w-64" />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/account" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
             <div className="px-3 py-2">
                <Input type="search" placeholder="Search..." className="w-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SiteNavigationMenu;