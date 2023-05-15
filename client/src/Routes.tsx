import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AddNewUser from "./Components/AddNewUser";
import EditUser from "./Components/EditUser";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path="addNewUser" element={<AddNewUser />} />
        <Route path="editUser/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing;