import { Dashboard } from '@/screens/Dashboard';
import { Toaster } from '@/components/atoms/sonner';

function App() {
  return (
    <div className="min-h-screen  font-sans antialiased">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default App;
