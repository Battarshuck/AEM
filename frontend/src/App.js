import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import Login from './components/login/login'
import Signup from './components/signup/signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        {/* <Route path="*" element={<NotFound/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
