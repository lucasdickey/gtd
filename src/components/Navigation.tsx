"use client";

import Link from "next/link";
import Image from "next/image";
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
    <nav 
      className="fixed top-0 z-10 w-full shadow-md"
      style={{
        backgroundColor: 'var(--brand-beige)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/a-ok-face.png"
                  alt="A-OK Face Logo"
                  width={40}
                  height={40}
                  className="mr-6 animate-slow-fade"
                />
              </Link>
            </div>

            <div className="flex space-x-8 relative">
              {/* Underline */}
              <div 
                className="absolute bottom-0 h-0.5 transition-all duration-300 ease-in-out"
                style={{
                  left: activeLeft,
                  width: activeWidth,
                  backgroundColor: 'var(--action-primary)',
                }}
              />
              
              {navItems.map((link, index) => (
                <Link
                  key={link.href}
                  ref={el => navRefs.current[index] = el}
                  href={link.href}
                  style={{
                    color: pathname === link.href ? 'var(--action-primary)' : undefined,
                  }}
                  className={`relative px-3 py-2 transition-colors duration-300 ${
                    pathname === link.href
                      ? "font-medium"
                      : "text-brand-brown dark:text-brand-beige hover:text-action-secondary dark:hover:text-action-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
