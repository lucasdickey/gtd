import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed top-0 z-10 w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
