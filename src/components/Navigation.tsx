"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [activeWidth, setActiveWidth] = useState(0);
  const [activeLeft, setActiveLeft] = useState(0);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.href === pathname);
    const activeRef = navRefs.current[activeIndex];
    
    if (activeRef) {
      setActiveWidth(activeRef.offsetWidth);
      setActiveLeft(activeRef.offsetLeft);
    }
  }, [pathname]);

  return (
    <nav className="fixed top-0 z-10 w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8 relative">
            {/* Animated Underline */}
            <div 
              className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-in-out"
              style={{
                left: activeLeft,
                width: activeWidth,
              }}
            />
            
            {/* Navigation Links */}
            {navItems.map((link, index) => (
              <Link
                key={link.href}
                ref={el => navRefs.current[index] = el}
                href={link.href}
                className={`relative px-3 py-2 transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
