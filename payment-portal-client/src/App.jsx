import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PaymentForm from './pages/PaymentForm';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute role="Customer">
              <PaymentForm />
            </ProtectedRoute>
          }
        />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route
          path="/employee/dashboard"
          element={
           <ProtectedRoute role="Employee">
            <EmployeeDashboard />
           </ProtectedRoute>
           }
           />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
