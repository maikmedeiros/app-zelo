const ALLOWED_PREFIXES = new Set([
  'class-accesses',
  'classes',
  'enrollments',
  'guardian-links',
  'guardians',
  'people',
  'posts',
  'reaction-types',
  'report-templates',
  'reports',
  'role-grants',
  'roles',
  'school-years',
  'sessions',
  'students',
  'teacher-links',
  'teachers',
  'users',
]);

const isSafeSegment = (segment: string): boolean =>
  segment.length > 0 && segment !== '.' && segment !== '..' && !segment.includes('\\');

export const resolveApiPath = (segments: string[]): string | null => {
  const [prefix] = segments;

  if (prefix === undefined || !ALLOWED_PREFIXES.has(prefix)) return null;
  if (!segments.every(isSafeSegment)) return null;

  return `/${segments.map(encodeURIComponent).join('/')}`;
};
