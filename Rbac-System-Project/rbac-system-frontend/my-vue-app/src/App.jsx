
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ActivateAccount from "./Components/Activate_Account";
import Login from "./Components/LogIn";
import CreateUser from "./Components/CreateUser";
import ResetRequest from "./Components/ResetRequest";
import ResetPassword from "./Components/ResetPassword";
import UsersList from "./Components/UsersList";
import EditUser from "./Components/EditUser";
import AdminPanel from "./Components/AdminPanel";
import AdminLogin from "./Components/AdminLogin";
import AdminEditUser from "./Components/AdminEditUser";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminLogIn" element={<AdminLogin />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/admin/edit/:id" element={<AdminEditUser />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/admin" element={<CreateUser />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="reset-request" element={<ResetRequest />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}