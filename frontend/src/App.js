import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import Login from './components/login/login'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path="*" element={<NotFound/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
