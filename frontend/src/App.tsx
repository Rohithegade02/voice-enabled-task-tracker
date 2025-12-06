import { Dashboard } from '@/screens/Dashboard';
import { Toaster } from '@/components/atoms/sonner';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default App;
