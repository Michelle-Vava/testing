import { useState, useEffect } from 'react';
import { Combobox } from './combobox';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  required = false,
  error,
  className = '',
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
        const data = await response.json();
        
        const formattedCountries = data
          .filter((country: any) => country.idd?.root)
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flag: country.flag,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        
        // Default to US/Canada
        const defaultCountry = formattedCountries.find(
          (c: Country) => c.code === 'US' || c.code === 'CA'
        ) || formattedCountries[0];
        setSelectedCountry(defaultCountry);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback countries
        const fallback: Country[] = [
          { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
          { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
          { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
        ];
        setCountries(fallback);
        setSelectedCountry(fallback[0]);
      }
    };

    fetchCountries();
  }, []);

  // Parse initial value
  useEffect(() => {
    if (value && countries.length > 0 && !phoneNumber) {
      const matchedCountry = countries.find((c) => value.startsWith(c.dialCode));
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setPhoneNumber(value.substring(matchedCountry.dialCode.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value, countries, phoneNumber]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      const fullNumber = phoneNumber ? `${country.dialCode} ${phoneNumber}` : '';
      onChange(fullNumber);
    }
  };

  const handlePhoneChange = (phone: string) => {
    // Remove non-numeric characters except spaces and dashes
    const cleaned = phone.replace(/[^\d\s-]/g, '');
    setPhoneNumber(cleaned);
    const fullNumber = selectedCountry ? `${selectedCountry.dialCode} ${cleaned}` : cleaned;
    onChange(fullNumber);
  };

  const countryOptions = countries.map((country) => ({
    value: country.code,
    label: `${country.flag} ${country.name} (${country.dialCode})`,
  }));

  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="w-48">
          <Combobox
            options={countryOptions}
            value={selectedCountry?.code || ''}
            onChange={handleCountryChange}
            placeholder="Country"
            searchPlaceholder="Search countries..."
          />
        </div>
        <div className="flex-1">
          <div className="relative">
            {selectedCountry && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {selectedCountry.dialCode}
              </span>
            )}
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full ${selectedCountry ? 'pl-16' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Phone number"
              required={required}
            />
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
