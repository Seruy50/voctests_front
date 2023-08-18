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
  const [server, setServer] = useState('https://voctests-back.onrender.com');
  const [site, setSite] = useState('https://voctests.onrender.com/');
  


  useEffect(() => {
    if(localStorage.getItem('VoC')){
    
      let token = JSON.parse(localStorage.getItem('VoC')).token;
      axios.post(server + 'tokenCheck', {token: token}).then(data => {
      if(data.data === "no"){
          navigate("/")
        } else {
        
        }
      })
      .catch(err => console.log(err))
    }
  },[navigate])

  return <div>

      {window.location.href === site ? null : <Header server={server} site={site}/>}
        <Routes>
            <Route exact path="/" element={<Registration server={server} site={site}/>}/> 
            <Route path="/userPage/collections" element={<Collections server={server} site={site}/>} />
            <Route path="/userPage/vocabluary" element={<Vocabluary />} />
            <Route path="/userPage/training" element={<Training server={server} site={site}/>} />
            <Route path="/userPage/getwords" element={<GetWords server={server} site={site}/>} />
        </Routes>
  </div>
    

}

export default App;


