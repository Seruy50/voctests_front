import React, {useState, useEffect} from 'react';
import stylesHeader from './styles/Header.module.css';
import {useNavigate} from 'react-router-dom';

export default function Header(){
    const [activeButton, setActiveButton] = useState();
    let user = JSON.parse(localStorage.getItem('VoC')).user;
    const navigate = useNavigate();
   

    useEffect(() => {
        switch(window.location.href){
            case 'http://localhost:3000/userPage/collections':
                setActiveButton("1");
                break;
            case 'http://localhost:3000/userPage/vocabluary':
                setActiveButton("2");
                break;
            case 'http://localhost:3000/userPage/training':
                setActiveButton("3");
                break;
            case 'http://localhost:3000/userPage/getwords':
                setActiveButton("4");
                break;
            default:
                setActiveButton("1");
        }   
    },[])
    return <div className={stylesHeader.main}>
        <div className={stylesHeader.navigation} onClick={(e) => setActiveButton(e.target.id)}>
            <button id="1" className={activeButton === "1" ? stylesHeader.buttonActive : stylesHeader.button} onClick={() => navigate('/userPage/collections')}>Collections</button>
            <button id="2" className={activeButton === "2" ? stylesHeader.buttonActive : stylesHeader.button} onClick={() => navigate('/userPage/vocabluary')}>Vocabluary</button>
            <button id="3" className={activeButton === "3" ? stylesHeader.buttonActive : stylesHeader.button} onClick={() => navigate('/userPage/training')}>Training</button>
            <button id="4" className={activeButton === "4" ? stylesHeader.buttonActive : stylesHeader.button} onClick={() => navigate('/userPage/getwords')}>getWords</button>
        </div>
        <div className={stylesHeader.profile}>
            <div className={stylesHeader.userName}>
                <p>Hi, {user.fullName}!</p>
            </div>  
            <div className={stylesHeader.icon}>

            </div>
            
        </div>
    </div>
}