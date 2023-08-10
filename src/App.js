import React, {useEffect, useState} from 'react';
import Registration from './components/Registration.jsx';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Collections from './components/Collections.jsx';
import Header from './components/Header.jsx';
import Vocabluary from './components/Vocabluary.jsx';
import GetWords from './components/GetWords.jsx';
import Training from './components/Training.jsx'



function App() {
  const navigate = useNavigate();


  useEffect(() => {
    if(localStorage.getItem('VoC')){
    
      let token = JSON.parse(localStorage.getItem('VoC')).token;
      axios.post('http://localhost:3001/tokenCheck', {token: token}).then(data => {
      if(data.data === "no"){
          navigate("/")
        } else {
        
        }
      })
      .catch(err => console.log(err))
    }
  },[navigate])

  return <div>

      {window.location.href === 'http://localhost:3000/' ? null : <Header />}
        <Routes>
            <Route path="/" element={<Registration />}/> 
            <Route path="/userPage/collections" element={<Collections />} />
            <Route path="/userPage/vocabluary" element={<Vocabluary />} />
            <Route path="/userPage/training" element={<Training />} />
            <Route path="/userPage/getwords" element={<GetWords />} />
        </Routes>
  </div>
    

}

export default App;


