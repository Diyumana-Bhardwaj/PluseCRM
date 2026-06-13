import { useState } from "react";
import { CRMProvider } from "./context/CRMContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <CRMProvider>
      {authenticated
        ? <Dashboard onLogout={() => setAuthenticated(false)} />
        : <LoginPage onLogin={() => setAuthenticated(true)} />
      }
    </CRMProvider>
  );
}