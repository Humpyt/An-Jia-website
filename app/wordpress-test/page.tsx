'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WordPressTestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState('wp/v2');
  const [id, setId] = useState('224');

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/wordpress-diagnostic?endpoint=${endpoint}&id=${id}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Run test on initial load
  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">WordPress API Diagnostic Tool</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="wp/v2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property ID (optional)
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="224"
            />
          </div>
        </div>
        
        <button
          onClick={runTest}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          {loading ? 'Testing...' : 'Run Test'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Request Information</h3>
            <p><strong>URL:</strong> {results.url}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Response Status</h3>
            <p className={`font-bold ${results.success ? 'text-green-600' : 'text-red-600'}`}>
              {results.status} {results.statusText}
            </p>
            <p><strong>Success:</strong> {results.success ? 'Yes' : 'No'}</p>
            {results.message && <p><strong>Message:</strong> {results.message}</p>}
          </div>
          
          {results.headers && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Response Headers</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40">
                {JSON.stringify(results.headers, null, 2)}
              </pre>
            </div>
          )}
          
          {results.success && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Data Information</h3>
                <p><strong>Data Type:</strong> {results.dataType}</p>
                <p><strong>Is Array:</strong> {results.isArray ? 'Yes' : 'No'}</p>
                <p><strong>Data Keys:</strong> {results.dataKeys.join(', ')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Data Sample</h3>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-96">
                  {JSON.stringify(results.dataSample, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
