import React from 'react';
import styles from './styles/main.module.css';
import RegLogForm from './regAndLogComp/RegLog.jsx';

export default function Registration({ logged, server, site }){

    return <div className={styles.mainBox}>
        <div className={styles.imageBox}>
        <img src={'https://live.staticflickr.com/65535/53105744727_de8e97db51_o.jpg'} alt="logo"/>
        </div>
        <hr className={styles.line}/>
        <RegLogForm logged={logged} server={server} site={site}/>
    </div>
}