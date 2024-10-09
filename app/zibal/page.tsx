    'use client';
    import { useState, useEffect, useRef } from 'react';
    import { useSearchParams } from 'next/navigation';
    import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
    
    interface ResponseData {
      message: string;
      amount?: number;
      date?: string;
      result?: {
        result: number;
        message?: string;
      };
      error?: string;
    }
    
    export default function ZibalPage() {
      const [response, setResponse] = useState<ResponseData | null>(null);
      const [error, setError] = useState<string | null>(null);
      const searchParams = useSearchParams();
      const hasFetched = useRef(false);
    
      useEffect(() => {
        if (hasFetched.current) return;
    
        const success = searchParams.get('success');
        const status = searchParams.get('status');
        const trackId = searchParams.get('trackId');
        const documentId = searchParams.get('documentId');
        const userId = searchParams.get('userId');
    
        console.log(success, status, trackId, documentId, userId);
        if (trackId) {
          hasFetched.current = true;
          const verifyPayment = async () => {
            try {
              const res = await fetch('/api/zibal', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackId, status, documentId, userId }),
              });
    
              const data: ResponseData = await res.json();
    
              if (res.ok) {
                if (data.result?.result === 100) {
                  setResponse(data);
                  setError(null);
                } else if (data.result?.result === 201) {
                  setError(data.result.message || 'Payment has already been verified.');
                  setResponse(null);
                } else {
                  setError(data.message || 'Payment Verification Failed.');
                  setResponse(null);
                }
              } else {
                setError(data.message || 'An error occurred while verifying the payment.');
                setResponse(null);
              }
            } catch {
              setError('An error occurred while verifying the payment.');
              setResponse(null);
            }
          };
    
          verifyPayment();
        }
      }, [searchParams]);
    
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">Payment Verification</h1>
          {response && (
            <div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">Payment Successful</h2>
              <div className="flex flex-col items-center space-y-4">
                <FiCheckCircle className="text-green-400 w-16 h-16 mb-4" />
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-white">{response.amount ? `${response.amount} Toman` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white">{response.date ? new Date(response.date).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Message:</span>
                    <span className="text-white">{response.message}</span>
                  </div>
                </div>
                {/* <a
                  href="/"
                  className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Return to Home
                </a> */}
              </div>
            </div>
          )}
          {error && (
            <div className="p-8 rounded-lg w-full max-w-md bg-gray-800 text-gray-300">
              <h2 className="text-2xl font-semibold mb-4">Notification</h2>
              <div className="flex flex-col items-center">
                <FiXCircle className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-center">{error}</p>
              </div>
            </div>
          )}
        </div>
      );
    }