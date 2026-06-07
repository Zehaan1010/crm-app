import { useState } from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return <Dashboard darkMode={darkMode} toggleTheme={toggleTheme} />;
}

export default App;
