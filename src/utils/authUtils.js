// Default read permissions for all pages
const DEFAULT_READ_PERMISSIONS = ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null];

// Specific permissions for write actions or restricted routes
const PERMISSION_MAP = {
  main: ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null], // Access to /main
  mainhome: ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null], // Access to /main
  oper: ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null], // Access to /main
  mainBoard: ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null], // Access and write actions for /main/board, /main/boardView, /main/boardWrite
  permissions: ['AUTH0001'], // Access to /permissions (super-admin only)
  test1: ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null], // Add for /main/test1
  tabulatorDirect: ['AUTH0001', 'AUTH0002', 'AUTH0003', '', null], // Add for /sample/TabulatorDirect
};

/**
 * Checks if the user has permission for a given screen
 * @param {string} userAuth - The user's auth value (e.g., 'AUTH0001')
 * @param {string} screen - The screen/route to check (e.g., 'mainBoard')
 * @returns {boolean} - True if the user has permission, false otherwise
 */
export function hasPermission(userAuth, screen) {
  if (!userAuth || !screen) return false;
  // Use specific permissions if defined, otherwise grant read access by default
  const allowedAuths = PERMISSION_MAP[screen] || DEFAULT_READ_PERMISSIONS;
  return allowedAuths.includes(userAuth);
}