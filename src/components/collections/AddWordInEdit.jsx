import react, { useState } from 'react';
import stylesCollections from '../styles/Collections.module.css';
import axios from 'axios';


export default function AddWord({ editCollection, user, setUser, collection, setCollection }){
    const [newWords, setNewWords] = useState([]);
    const [previewWordId, setPreviewWordId] = useState(1);

    let collectionId = editCollection.collectionId;
    let wordId = user.collections.find(data => {
        return data._id === collectionId
    }).words.length + 1;
    

    const submitForm = (e) => {
        e.preventDefault();

        if(e.target.wordEng.value.trim() && e.target.wordUkr.value.trim()){
            e.preventDefault();
        
            let word = {
            id: previewWordId,
            eng: e.target.wordEng.value.toLowerCase().trim(),
            ukr: e.target.wordUkr.value.toLowerCase().trim(),
            part: e.target.partOfLanguage.value
            }

            setNewWords([...newWords, word]);
            
            setPreviewWordId(previewWordId + 1);
        }
    }

    const deleteItemFromPreview = (e) => {
        let id = wordId;
     
        let words = newWords.filter(item => +item.id !== +e.target.id);
        
        words.forEach(word => {
            word.id = id;
            id++;
        })
       
        setNewWords(words)
    }

    const sendWords = () => {
        let id = wordId;
        console.log(id)
        
        let finalWords = newWords.map(word => {
            word.id = id;
            id++
            return word;
        })

        
        let allWords = [...collection.words, ...finalWords]
        
        
        setCollection({...collection, words: allWords})

        user.collections.forEach(coll => {
            if (coll._id === collectionId){
                return coll.words = allWords;
            } else {
                return coll;
            }
        })

        console.log(user.collections)

        localStorage.setItem('VoC', JSON.stringify(user));
        
        let data = {
            id: collectionId,
            words: finalWords,
            command: 'add'
        }

        axios.patch('http://localhost:3001/changeCollection', data)
        .then()
        .catch(err => console.log(err))

        setNewWords([]);
        setUser(JSON.parse(localStorage.getItem('VoC')))
    }



    return <div className={stylesCollections.addWordsMainBlock}>
        <div>
            <form className={stylesCollections.addWordsForm}  onSubmit={(e) => submitForm(e)}>
                    <div>
                        <label>Word:</label><br />
                        <input name="wordEng"></input>
                    </div>
                    <div>
                        <label>Translations:</label> <br />
                        <input name="wordUkr"></input>
                    </div>
                    <div>
                        <label>Part of language:</label><br/>
                        <select name="partOfLanguage" defaultValue="none">
                            <option value="noun">Noun</option>
                            <option value="pronoun">Pronoun</option>
                            <option value="adjective">Adjective</option>
                            <option value="verb">Verb</option>
                            <option value="adverb">Adverb</option>
                            <option value="preposition">Preposition</option>
                            <option value="interiection">Interiection</option>
                            <option value="conjunction">Conjunction</option>
                        </select>
                    </div>
                    <button type="submit">Add</button>
            </form>
            <div className={stylesCollections.addWordsPreView}>
                <p>Preview:</p>
                <div >
                    <hr />
                    <ol onClick={e => deleteItemFromPreview(e)}>
                        {newWords.map((word, index) => {
                        return <li key={index} ><span ><b id={word.id}>{word.eng.toUpperCase()}</b></span> - {word.ukr} /<i>{word.part}</i>/;</li>
                        })}
                    </ol>
                </div>
            </div>
       </div>
            <button className={stylesCollections.addWordsSendButton} onClick={sendWords}>Add words to collection</button>
    </div> 
}