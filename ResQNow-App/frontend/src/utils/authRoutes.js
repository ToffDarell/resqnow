// src/utils/authRoutes.js

// Return the correct home page for the
// authenticated server-side role.
export function homeForUser(user) {
  switch (user?.role) {
    case 'resident':
      return '/dashboard';

    case 'responder':
      return '/responder';

    case 'admin':
      return '/dispatch';

    default:
      return '/login';
  }
}