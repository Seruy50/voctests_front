import react, { useState } from 'react';
import stylesCollections from '../styles/Collections.module.css';
import axios from 'axios';
import AddWord from './AddWordInEdit.jsx';
import deleteWordImage from '../images/delete.png';
import { v4 as uuidv4 } from 'uuid';



export default function EditCollectionWindow({ editCollection, setEditCollection }){
    const [section, setSection] = useState('Show collection');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('VoC')))


    let collectionId = editCollection.collectionId;
    
    const [collection, setCollection] = useState(user.collections.find(data => data._id === collectionId))
    
    

    
    const deleteWord = (e) => {
        let newCollection = collection.words.filter(word => +word.id !== +e.target.id);

        let id = 1;

        newCollection.forEach(word => {
            word.id = id;
            id++;
        })
        setCollection({...collection, words: newCollection});
        
        let doubleUser = user;

        doubleUser.collections.forEach(data => {
            if(data._id === collectionId){
                return data.words = newCollection;
            } else {
                return data;
            }
        })

        setUser({...doubleUser})
    }

 

    const saveChanges = (e) => {
        e.preventDefault()

        let data = {
            words: JSON.stringify(collection.words),
            id: collectionId
        }
        
        
        axios.patch('http://localhost:3001/changeCollection', data);

        localStorage.setItem('VoC', JSON.stringify(user))
    }


    const changeWordEng = (e, id) => {
        console.log(e.keyCode)
        collection.words.map(word => {
            if(word.id === id){
               return word.eng = e.target.value;  
            } 
        })

        setUser({...user, collection});
       
    }


    const changeWord = (e, id) => {   
        console.log(e.target.value)
        collection.words.map(word => {
            if(word.id === id){
               word.ukr = e.target.value;
            } 
        })

        setUser({...user, collection});
    }

    const changePart = (e, id) => {
        collection.words.map(word => {
            if(word.id === id){
               return word.part = e.target.value;  
            } 
        })

        setUser({...user, collection});
    }

    
    const showWords = () => {
        
        let listOfWords = collection.words.map(word => {
           
           
            return <li key={uuidv4()}>
                            <img id={word.id} 
                                 onClick={(e) => deleteWord(e)}
                                 src={deleteWordImage} 
                                 alt="none" 
                                 draggable="false"
                            />
                            <input defaultValue={word.eng.toUpperCase()} onBlur={e => changeWordEng(e, word.id)} />
                            <input defaultValue={word.ukr} 
                                   onBlur={(e) => changeWord(e, word.id)}
                                   
                            />
                            <select name="partOfLanguage" defaultValue={word.part}  onBlur={e => changePart(e, word.id)}>
                                <option value="noun">Noun</option>
                                <option value="pronoun">Pronoun</option>
                                <option value="adjective">Adjective</option>
                                <option value="verb">Verb</option>
                                <option value="adverb">Adverb</option>
                                <option value="preposition">Preposition</option>
                                <option value="interiection">Interiection</option>
                                <option value="conjunction">Conjunction</option>
                            </select>
                    </li>
        })
        return <div className={stylesCollections.viewWordsMain}>
                    <div>
                        <hr />
                       <form id="changeWordsForm" onSubmit={(e) => saveChanges(e)}>
                            <ol className={stylesCollections.editCollectionList}>
                                {listOfWords}
                            </ol>
                       </form>
                    </div>
                    
                        <button className={stylesCollections.viewWordsMainButtonSave} type="submit" form='changeWordsForm'>Save changes</button>
                    
        </div>
    }

    return <div className={stylesCollections.editWindow}>
        <div className={stylesCollections.editWindowbuttonsContainer}>
            <button className={section === 'Show collection' ? stylesCollections.addWordActiveButton : stylesCollections.editButtonsInContainer} onClick={() => setSection('Show collection')}>Edit collection</button>
            <button className={section === 'New word' ? stylesCollections.addWordActiveButton : stylesCollections.editButtonsInContainer} onClick={() => setSection('New word')}>Add new words</button>
            <div onClick={() => setEditCollection({...editCollection, show: false})} className={stylesCollections.generalCloseButton}><span></span><span></span></div>
        </div>
        <div>
            {section === 'Show collection' ? showWords() : <AddWord editCollection={editCollection} user={user} setUser={setUser} collection={collection} setCollection={setCollection}/>}
        </div>
    </div>
}