import {useState} from 'react';
import styles from './styles/ProfileSpace.module.css'
import axios from 'axios';

export default function ProfileSpace(){
    const [personalDataSwitcher, setPersonalDataSwitcher] = useState('data')

    let user = JSON.parse(localStorage.getItem('VoC')).user;
    
    let sideButtons = [
        <button className="sideButton">Personal data</button>,
        <button className="sideButton">Enter data</button>,
        <button className="sideButton">LOG OUT</button>,
    ]

    let personalData = [
        <img src="https://scontent-iev1-1.xx.fbcdn.net/v/t1.6435-9/111114956_669488966972738_6966759928212443321_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=5_FVaq5unrEAX8_ftaJ&_nc_ht=scontent-iev1-1.xx&oh=00_AfDqSNcnHW2OOEo6RaByJleNvsfC2Q-wFvRsQCK1dgNxVg&oe=65058E17" alt="No data"></img>,
        <p><span>Name:</span><span>{user.fullName.slice(0, user.fullName.indexOf(' '))}</span></p>,
        <p><span>Surname:</span><span>{user.fullName.slice(user.fullName.indexOf(' ') + 1)}</span></p>,
        <p><span>Email:</span><span>{user.email}</span></p>,
        <p><span>Age:</span><span>{user.age ? user.age : ''}</span></p>,
        <p><span>Country:</span><span>{user.country ? user.country : ''}</span></p>
    ]

    let editPersonalData = <form
             id="editPersonalData" 
             className={styles.workingField_personalDataForm}
             onSubmit={(e) => editPersonalSubmit(e)}
        >
            <p><span>Avatar:</span><span><input name="avatar" type="file"></input></span></p>
            <p><span>Full name:</span><span><input name="fullName" type="text" defaultValue={user.fullName}></input></span></p>
            <p><span>Email:</span><span><input name="email" type="email" defaultValue={user.email}></input></span></p>
            <p><span>Age:</span><span><input name="age" type="number" defaultValue={user.age}></input></span></p>
            <p><span>Country:</span><span><input name="country"  type="text" defaultValue={user.country}></input></span></p>
        </form>

    const editPersonalSubmit = (e) => {
        e.preventDefault();

        let form = document.querySelector('#editPersonalData');
        let data = new FormData(form)
        
        for (let elem of data.entries()) console.log(elem)
        console.log(data)
    }

    return <div className={styles.mainBlock}>
                <div className={styles.sideButtonsSpace}>
                    {sideButtons}
                </div>
                <div className={styles.workingField}>
                    {personalDataSwitcher === 'data'
                        ?
                        <>
                            {personalData}
                            <button onClick={() => setPersonalDataSwitcher('d')}>Edit my info</button>
                        </>
                        :
                        <>
                            {editPersonalData}
                            <button type="submit" form="editPersonalData">Apply</button>
                        </>
                        
                        }
                    
                </div>
    </div>
}