import { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./pages/home/Home";
import { Categories } from "./pages/categories/Categories";
import { Create } from "./pages/create/Create";
import { CalendarPage } from "./pages/calendar/Calendar";
import { Notifications } from "./pages/notifications/Notifications";
import { LoadingScreen } from "./components/loadingScreen";
import "./components/loading.css";

// 1. Create context
export const AdminContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // 2. Admin state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    // 3. Provide context to app
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="/create" element={<Create />} />
        <Route path="/create/:id" element={<Create />} />
      </Routes>
    </AdminContext.Provider>
  );
}

export default App;