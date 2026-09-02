export const normalizeCpf = (value: string): string => value.replace(/\D/g, '');

const checkDigit = (digits: string, firstWeight: number): number => {
  const sum = [...digits].reduce(
    (total, char, index) => total + Number(char) * (firstWeight - index),
    0,
  );
  const rest = (sum * 10) % 11;

  return rest === 10 ? 0 : rest;
};

export const isValidCpf = (value: string): boolean => {
  const cpf = normalizeCpf(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  return (
    checkDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    checkDigit(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
};

export const formatCpf = (value: string): string => {
  const cpf = normalizeCpf(value);
  if (cpf.length !== 11) return value;

  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
};

export const maskCpf = (value: string): string => {
  const cpf = normalizeCpf(value).slice(0, 11);

  return cpf
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
};
