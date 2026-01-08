export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' },
] as const;

export type ProvinceCode = typeof CANADIAN_PROVINCES[number]['code'];

export function validatePostalCode(postalCode: string): boolean {
  const regex = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;
  return regex.test(postalCode);
}

export function formatPostalCode(input: string): string {
  // Remove spaces and convert to uppercase
  const cleaned = input.replace(/\s/g, '').toUpperCase();
  
  // Format as A1A 1A1
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  }
  
  return cleaned;
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic validation - accepts (555) 123-4567, 555-123-4567, 5551234567
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}

export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}
