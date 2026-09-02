export const normalizePhone = (value: string): string => value.replace(/\D/g, '');

export const formatPhone = (value: string): string => {
  const phone = normalizePhone(value);

  if (phone.length === 11) return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  if (phone.length === 10) return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;

  return value;
};
