import react, {useState} from 'react';
import styles from '../styles/Training.module.css';
import words from '../../Words.js'
import axios from 'axios';



export default function Settings(props){
    const [block, setBlock] = useState(false);

    let user = JSON.parse(localStorage.getItem('VoC'));
    let wordsForGeneralTest = [];

    const formSubmit = (e) => {
        e.preventDefault();

        let trainingCollection = [];

        let form = document.querySelector('#setingsBar');
        let formData = new FormData(form);
        
        for (let elem of formData){
            trainingCollection.push(elem[1])
        }
        
      

        if (
            trainingCollection[1] > props.currentCollectionChoice.length  
            || trainingCollection[2] > props.currentCollectionChoice.length
            || trainingCollection[1] === ''
            || trainingCollection[2] === ''
            || +trainingCollection[1] + +trainingCollection[2] > props.currentCollectionChoice.length + 1
            ){
                setBlock(true);
                return null;
            } else {
                user.collections.map(collection => {
                    if(collection.name === trainingCollection[0]){
                        if (trainingCollection[1] && trainingCollection[2]){
                            let quantity = trainingCollection[1];
                            let start = trainingCollection[2];
                            for(start; start <= collection.words.length; start++){
                                wordsForGeneralTest.push(collection.words[start - 1])
                                if(wordsForGeneralTest.length === +quantity){
                                    return wordsForGeneralTest;
                                }
                            }
        
                        }
                        
                        return wordsForGeneralTest;
                    } 
                })
               
                if (trainingCollection[3]){
                    shuffleArray(wordsForGeneralTest)
                } 
                
                wordsForGeneralTest.map(word => {
                    let id = 'a' + word.id;
                    let p = <li key={word.id}><span>{word.eng.slice(0, 1).toUpperCase() + word.eng.slice(1)}</span><hr/><input className="day" id={id} onKeyDown={e => enterCheck(e)} onBlur={(e) => wordCheck(e, word.ukr, id, word, props)} autoComplete="off"/></li>
                    let c = props.words;
                    c.push(p)
                    props.setWords(props.words)
        
                })
        
                props.setStage('generalTest');
            }    
    }



    return <div className={styles.mainSetingsWindow}>
                <form className={styles.settingsBar} id="setingsBar" onSubmit={e => formSubmit(e)}>
                    <label> Select collection:
                        <select name="collectionChoose" onChange={e => props.currentCollection(e)} >
                            {props.collectionsNames}
                        </select>
                    </label>
                    <label> Count of words:
                        <input name="countOfWords" defaultValue="1" onChange={() => setBlock(false)}/>
                        <p style={{opacity: block ? "1" : "0"}} className={styles.warningsUnderInputs}>Choosen collecction have only {props.currentCollectionChoice.length} words!</p>
                    </label>
                    <label> Start from word (number in list):
                        <input name="startPosition" defaultValue="1" onChange={() => setBlock(false)}/>
                        <p style={{opacity: block ? "1" : "0"}} className={styles.warningsUnderInputs}>Avialable start is from 1 to {props.currentCollectionChoice.length}! Quantity of words should allow your start position!</p>
                    </label>
                    <label>Random order:
                        <input name="order" type="checkbox" />
                    </label>
                </form>
                <div>
                    <button type="submit" form="setingsBar">Go!</button>
                </div>
            </div>

}

const wordCheck = (e, ukr, id, word, props) => {
    e.target.setAttribute('disabled', 'disabled');
    e.target.value.length > 0 ? e.target.disabled = true : e.target.disabled = false;
                    
    if (e.target.value.length > 0) {
     
        let input = document.querySelector(`#${id}`)
        ukr = ukr.split(', ')
        if (ukr.includes(e.target.value)){
            input.style.border = "green";
            input.style.color = "green";
        } else {
            input.style.border = "green";
            input.style.color = "red";
            let wrong = props.wordsWithMistakes;
            wrong.push(word)
            props.setWordsWithMistakes(wrong)
        }
    }
}

const enterCheck = (e) => {
    if (e.keyCode === 13){   
        e.target.blur();
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}