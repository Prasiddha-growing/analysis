import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message = 'An error occurred. Please try again later.' }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
      <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
      <p className="text-red-700">{message}</p>
    </div>
  );
}