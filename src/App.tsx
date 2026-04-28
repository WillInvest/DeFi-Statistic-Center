import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Workbench } from './pages/Workbench';
import { Mempool } from './pages/Mempool';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/workbench" element={<Workbench />} />
        <Route path="/mempool" element={<Mempool />} />
      </Routes>
    </BrowserRouter>
  );
}
