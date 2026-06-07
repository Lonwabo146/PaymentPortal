import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import PaymentForm from './pages/paymentForm';
import EmployeeLogin from './pages/employeeLogin';
import EmployeeDashboard from './pages/employeeDashboard';
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
