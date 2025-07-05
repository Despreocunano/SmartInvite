import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface CountryOption {
  value: string;
  label: string;
  flagCode: string;
}

interface CountrySelectProps {
  id?: string;
  label?: string;
  options?: CountryOption[];
  error?: string;
  defaultValue?: string;
  [key: string]: any;
}

export function CountrySelect({ 
  id, 
  label, 
  options = [], 
  error, 
  defaultValue, 
  onChange,
  value,
  ...props 
}: CountrySelectProps) {
  const { t } = useTranslation('auth');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultOptions: CountryOption[] = [
    { value: 'MX', label: t('register.mx'), flagCode: 'mx' },
    { value: 'PA', label: t('register.pa'), flagCode: 'pa' },
    { value: 'US', label: t('register.us'), flagCode: 'us' },
  ];

  const countryOptions = options.length > 0 ? options : defaultOptions;
  const selectedOption = countryOptions.find(option => option.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: CountryOption) => {
    setSelectedValue(option.value);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { value: option.value } } as any);
    }
  };

  return (
    <div className="space-y-1" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
            sm:text-sm flex items-center justify-between
            ${error 
              ? 'border-red-300 text-red-900' 
              : 'border-gray-300 text-gray-900'
            }
          `}
        >
          <div className="flex items-center">
            {selectedOption ? (
              <>
                <img 
                  src={`https://flagcdn.com/${selectedOption.flagCode}.svg`} 
                  alt={selectedOption.label}
                  className="w-4 h-4 mr-2 rounded-sm"
                />
                <span>{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-500">{t('register.select_country')}</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {countryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center"
              >
                <img 
                  src={`https://flagcdn.com/${option.flagCode}.svg`} 
                  alt={option.label}
                  className="w-4 h-4 mr-2 rounded-sm"
                />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 