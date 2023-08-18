import React, {useState, useEffect} from 'react';
import stylesHeader from './styles/Header.module.css';
import {useNavigate} from 'react-router-dom';
import ProfileSpace from './ProfileSpace'


export default function Header({server, site}){
    const [activeButton, setActiveButton] = useState();
    const [showProfile, setShowProfile] = useState('none');
    let user = JSON.parse(localStorage.getItem('VoC')).user;
    const navigate = useNavigate();
   
    useEffect(() => {
        switch(window.location.href){
            case site + 'userPage/collections':
                setActiveButton("1");
                break;
            case site + 'userPage/vocabluary':
                setActiveButton("2");
                break;
            case site + 'userPage/training':
                setActiveButton("3");
                break;
            case site + 'userPage/getwords':
                setActiveButton("4");
                break;
            default:
                setActiveButton("1");
        }   
    },[])
    return <div>
    <div className={stylesHeader.main}>
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
            <div className={stylesHeader.iconHolder}>
                <div 
                    className={stylesHeader.icon} 
                    onClick={() => setShowProfile(showProfile === 'none' ? true : !showProfile)} 
                    style={{
                        width: showProfile === true ? "100px" : null,
                        height: showProfile === true ? "100px" : null
                    }}
                >
                    <img src="https://scontent-iev1-1.xx.fbcdn.net/v/t1.6435-9/111114956_669488966972738_6966759928212443321_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=5_FVaq5unrEAX8_ftaJ&_nc_ht=scontent-iev1-1.xx&oh=00_AfDqSNcnHW2OOEo6RaByJleNvsfC2Q-wFvRsQCK1dgNxVg&oe=65058E17" alt="No data"></img>
                </div>
            </div>
        </div>   
    </div>
         <div style={{display: showProfile === 'none' ? 'none' : null }} className={showProfile === 'none' ? null : (showProfile ? stylesHeader.mainBlockProfileContainerDown : stylesHeader.mainBlockProfileContainerUp)}>
             <ProfileSpace />
        </div>
    </div>
}