export const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

const monthsBetween = (birth: string, today: string): number => {
  const [birthYear, birthMonth, birthDay] = birth.slice(0, 10).split('-').map(Number);
  const [year, month, day] = today.slice(0, 10).split('-').map(Number);

  if (
    birthYear === undefined ||
    birthMonth === undefined ||
    birthDay === undefined ||
    year === undefined ||
    month === undefined ||
    day === undefined
  ) {
    return -1;
  }

  const months = (year - birthYear) * 12 + (month - birthMonth);
  return day < birthDay ? months - 1 : months;
};

export const formatAge = (birthDate: string, today = todayIso()): string | null => {
  const months = monthsBetween(birthDate, today);
  if (months < 0) return null;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const yearLabel = years === 1 ? '1 ano' : `${years} anos`;
  const monthLabel = remainingMonths === 1 ? '1 mês' : `${remainingMonths} meses`;

  if (years === 0) return monthLabel;
  if (remainingMonths === 0) return yearLabel;

  return `${yearLabel} e ${monthLabel}`;
};
