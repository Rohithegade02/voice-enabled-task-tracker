import React from 'react';
import { Dashboard } from '@/screens/Dashboard';
import { Toaster } from '@/components/atoms/sonner';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default App;
