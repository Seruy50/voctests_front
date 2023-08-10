import react, {useState} from 'react';
import stylesCollections from '../styles/Collections.module.css';
import axios from 'axios';



export default function AddCollection({setCollections, addCollection, setAddCollection}){
    
    let user = JSON.parse(localStorage.getItem('VoC')).user;

   async  function sendCollection(){
        let data = {
            name: addCollection.name,
            theme: addCollection.theme,
            _id: user._id,
        }
        await axios.post('https://voctests-back.onrender.com/addCollection', data).then((data) => {
            let local = JSON.parse(localStorage.getItem("VoC"));
            console.log(data.data)
            local.collections = data.data;      
            localStorage.setItem("VoC", JSON.stringify(local))
            setCollections(data.data)
        })
        .catch(err => console.log(err));
        setAddCollection({show: false, phase: '1', name: '', theme: ''})


    }

    let addCollectionName = <div className={stylesCollections.addCollectionName}>
            <label>Enter name of the collection:</label>
            <input value={addCollection.name} onChange={(e) => setAddCollection({...addCollection, name: e.target.value})}></input>
            
           {addCollection.name.match(/^[^0-9\s]{1}/gi) && addCollection.name.length > 2
                ?
                <button onClick={() => {
                    setAddCollection({...addCollection, phase: '2'})
                    console.log(addCollection)}}>Apply</button>
                :
                null
            }
    </div>
    let addCollectionTheme = <div className={stylesCollections.addCollectionTheme} onClick={(e) => setAddCollection({...addCollection, theme: e.target.value})}>
        <p>Choose theme:</p>
        <div>
            <button style={{"backgroundColor": "red"}} value="red"></button>
            <button style={{"backgroundColor": "green"}} value="green"></button>
            <button style={{"backgroundColor": "purple"}} value="purble"></button>
            <button style={{"backgroundColor": "blue"}} value="blue"></button>
            <button style={{"backgroundColor": "yellow"}} value="yellow"></button>
            <button style={{"backgroundColor": "black"}} value="black"></button>
        </div>
        {
        addCollection.theme 
            ?
            <button className={stylesCollections.addCollectionThemeButton} onClick={(e) => {
                e.stopPropagation()
                sendCollection();
                }}>Apply</button>
            :
            null
        }   
    </div>

    return <div className={stylesCollections.addWindow}>
                {addCollection.phase === '1' 
                    ? 
                    addCollectionName 
                    : 
                    addCollectionTheme}
           </div> 

}