// Role tiers: 'customer' / 'rider' are regular users. 'admin' can operate
// the dashboard (stats, active rides, feedback inbox). 'super_admin' can do
// everything 'admin' can, plus manage other users' roles.
export function isAdminRole(role) {
  return role === "admin" || role === "super_admin";
}

export function isSuperAdminRole(role) {
  return role === "super_admin";
}
