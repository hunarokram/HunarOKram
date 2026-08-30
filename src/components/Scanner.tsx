'use client';
import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export default function Scanner({ onScanSuccess, onScanFailure }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          // Optional: pause after scan to prevent multiple rapid scans
          scannerRef.current?.pause();
          setTimeout(() => {
            if (scannerRef.current?.getState() === 2) { // 2 is PAUSED
               scannerRef.current?.resume();
            }
          }, 3000);
        },
        (error) => {
          if (onScanFailure) {
            onScanFailure(error);
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id="reader" className="w-full max-w-md mx-auto overflow-hidden rounded-xl border border-warm-200"></div>;
}
