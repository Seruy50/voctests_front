import React from 'react';
import styles from './styles/main.module.css';
import RegLogForm from './regAndLogComp/RegLog.jsx';
import logoMain from './images/logoMain.jpg';

export default function Registration({ logged }){

    return <div className={styles.mainBox}>
        <div className={styles.imageBox}>
        <img src={logoMain} alt="logo"/>
        </div>
        <hr className={styles.line}/>
        <RegLogForm logged={logged}/>
    </div>
}