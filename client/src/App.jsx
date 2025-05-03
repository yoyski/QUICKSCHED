import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./pages/home/Home";
import { Categories } from "./pages/categories/Categories";
import { Create } from "./pages/create/Create";
import { Calendar } from "./pages/calendar/Calendar";
import { Notifications } from "./pages/notifications/Notifications";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="/create" element={<Create />}/>
    </Routes>
    </>
  )
}

export default App;