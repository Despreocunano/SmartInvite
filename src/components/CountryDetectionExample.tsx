import React from 'react';
import { useCountryDetection } from '../hooks/useCountryDetection';
import { detectCountryFromURL, getCountryAndLanguage } from '../lib/countryDetection';

/**
 * Example component showing how to use country detection
 * This can be used for debugging or as a reference
 */
export function CountryDetectionExample() {
  const { country, language, detected, refreshDetection } = useCountryDetection();
  
  // Get current info without using the hook
  const currentInfo = getCountryAndLanguage();
  const directDetection = detectCountryFromURL();

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Country Detection Example</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Using Hook:</strong>
          <ul className="ml-4 text-sm">
            <li>Country: {country || 'Not detected'}</li>
            <li>Language: {language}</li>
            <li>Detected: {detected ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        
        <div>
          <strong>Direct Detection:</strong>
          <ul className="ml-4 text-sm">
            <li>Country: {directDetection || 'Not detected'}</li>
            <li>Full Info: {JSON.stringify(currentInfo)}</li>
          </ul>
        </div>
        
        <div>
          <strong>Current URL Info:</strong>
          <ul className="ml-4 text-sm">
            <li>Hostname: {window.location.hostname}</li>
            <li>Pathname: {window.location.pathname}</li>
            <li>Referrer: {document.referrer || 'None'}</li>
          </ul>
        </div>
        
        <button 
          onClick={refreshDetection}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Refresh Detection
        </button>
      </div>
    </div>
  );
} 