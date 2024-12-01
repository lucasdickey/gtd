export const routeTitles = {
  '/': null, // Will use default 'ꓘO-∀'
  '/projects': 'Projects',
  '/blog': 'Musings',
  '/about': 'About',
} as const

// Helper function to get title for a route
export function getRouteTitle(path: string) {
  const title = routeTitles[path as keyof typeof routeTitles]
  return title || null // Return null for home page to use default
}
