import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./pages/home/Home";
import { Categories } from "./pages/categories/Categories";
import { Create } from "./pages/create/Create";
import { CalendarPage } from "./pages/calendar/Calendar";
import { Notifications } from "./pages/notifications/Notifications";
import { LoadingScreen } from "./components/loadingScreen";
import "./components/loading.css"; // make sure it's imported

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
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
  );
}

export default App;
