import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Pages/Login';
import Signup from './Components/Pages/Signup';
import AccountForm from './Components/Pages/AccountForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardPage from './Components/Pages/DashboardPage';
import AccountDetailes from './Components/Pages/AccountDetailes';
import OrderHistoryPage from './Components/Pages/OrderHistoryPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup-page" element={<Signup />} />
          <Route path="/account-create-form" element={<AccountForm />} />
          <Route path='/dashborad-page' element={<DashboardPage/>} />
          <Route path='/account-details' element={<AccountDetailes />}></Route>
          <Route path='/order-history' element={<OrderHistoryPage />}></Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-center" autoClose={3000} pauseOnHover={false} closeOnClick draggable limit={3}/>
    </>
  );
}

export default App;
