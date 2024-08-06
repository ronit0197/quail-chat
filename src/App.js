import { useContext } from 'react';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import './Style.scss'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from './Context/AuthContext';

function App() {

  const {currentUser} = useContext(AuthContext)

  const ProtectedRoute = ({children}) =>{
    if(!currentUser){
      return <Navigate to="/login" />
    }

    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>}/>
            <Route path='login' element={<Login />}/>
            <Route path='register' element={<Registration />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
