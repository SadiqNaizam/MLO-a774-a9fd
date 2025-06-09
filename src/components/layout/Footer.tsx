import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "Best Sellers", href: "/products?sort=popular" },
        { label: "Sale", href: "/sale" },
      ]
    },
    {
      title: "Customer Service",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Returns", href: "/shipping-returns" },
        { label: "Track Order", href: "/track-order" },
      ]
    },
    {
      title: "About Us",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Affiliates", href: "/affiliates" },
      ]
    }
  ];

  const socialLinks = [
    { label: "Twitter", icon: Twitter, href: "#" },
    { label: "LinkedIn", icon: Linkedin, href: "#" },
    { label: "Github", icon: Github, href: "#" },
    { label: "Instagram", icon: Instagram, href: "#" },
    { label: "Youtube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1 mb-6 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-primary mb-2 inline-block">
              MyApp
            </Link>
            <p className="text-sm">
              High-quality products delivered to your doorstep.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">
            &copy; {currentYear} MyApp Inc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} className="hover:text-primary transition-colors" aria-label={social.label}>
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;