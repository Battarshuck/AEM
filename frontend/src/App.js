import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import Login from './components/login/login'
import Signup from './components/signup/signup'
import localRoutes from './localRoutes/localRoutes'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path={localRoutes.logIn} element={<Login/>} />
        <Route path={localRoutes.signUp} element={<Signup/>} />
        {/* <Route path="*" element={<NotFound/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
