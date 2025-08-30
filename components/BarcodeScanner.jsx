"use client";
import { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function BarcodeScanner({ onScan, onError, isActive = false }) {
  const videoRef = useRef(null);
  const [codeReader, setCodeReader] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setCodeReader(reader);
    
    return () => {
      if (reader) {
        reader.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && codeReader && !isScanning) {
      startScanning();
    } else if (!isActive && codeReader) {
      stopScanning();
    }
  }, [isActive, codeReader]);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start decoding from video element
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) {
          console.log('Barcode detected:', result.getText());
          onScan(result.getText());
          stopScanning(); // Stop after successful scan
        }
        if (error && error.name !== 'NotFoundException') {
          console.error('Scanner error:', error);
          onError?.(error.message);
        }
      });

    } catch (err) {
      console.error('Error starting camera:', err);
      setHasPermission(false);
      setIsScanning(false);
      onError?.('Camera access denied or not available');
    }
  };

  const stopScanning = () => {
    if (codeReader) {
      codeReader.reset();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  if (hasPermission === false) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700 text-sm">
          Camera access is required for barcode scanning. Please enable camera permissions and try again.
        </p>
      </div>
    );
  }

  if (!isActive) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-white border-opacity-50 rounded-lg" 
               style={{ width: '80%', height: '60%' }}>
            <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-pulse opacity-75"></div>
          </div>
        </div>
        
        {/* Scanning indicator */}
        {isScanning && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
            📷 Scanning for barcode...
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Point your camera at a barcode to scan
        </p>
        <button
          onClick={stopScanning}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel Scan
        </button>
      </div>
    </div>
  );
}
