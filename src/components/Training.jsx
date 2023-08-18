import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import styles from './styles/Training.module.css';
import axios from 'axios';
import Settings from './training/Settings.jsx';
import TrainingWithWords from './training/TrainingWithWords.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Training({server, site}){
    const [stage, setStage] = useState('setings');
    const [whatToDo, setWhatToDo] = useState();
    const [addCreateBlock, setAddCreateBlock] = useState();
  
    let user = JSON.parse(localStorage.getItem('VoC'));
    const [currentCollectionChoice, setCurrentCollectionChoice] = useState([...user.collections[0].words]);

    const [words, setWords] = useState([]);
    const [wordsWithMistakes, setWordsWithMistakes] = useState([]);
   
    const navigate = useNavigate();

    

    
    

    let collectionsNames = [];

    user.collections.map(collection => collectionsNames.push(<option style={{backgroundColor: collection.theme}} key={collection._id} value={collection.name}>{collection.name}</option>))

   
    let wordsWithMistakesList = wordsWithMistakes.map(word => {
        return <li key={word.id}><span>{word.eng}</span><hr /><span>{word.ukr}</span> <img src={'https://live.staticflickr.com/65535/53106361476_8a858d073e_o.png'} alt="" onClick={() => deleteWord(word.id)}/></li>
    })

    const deleteWord = (id) => {
        let words = wordsWithMistakes.filter(word => word.id !== id)
        setWordsWithMistakes(words);
    }

    

    const currentCollection = (e) => {
        user.collections.map(collection => {
            if(collection.name === e.target.value){
                return setCurrentCollectionChoice([...collection.words]);
            } 
        })
    }
    
    let generalTest = <>
        <div className={styles.generalTestContainer}>
            <ol>
              {words}
            </ol>
            <button onClick={() => {checkToGoOnMistakesStage()}} >Check</button>
        </div>  
        <div onClick={() => navigate('/userPage/training')} className={styles.buttonCloseTrainingField}><span></span><span></span></div>
    </>

    function checkToGoOnMistakesStage(){
        
            
        let inputs = document.querySelectorAll('input');
    
        for(let input of inputs){
            
            if (!input.value){
                
                return toast.warning('Enter translation for all words!', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
        }
    setStage('wrongWords');
    }

    const createCollectionFromForm = (e) => {
        e.preventDefault();
        let form = document.querySelector('#formCreateCollection');
        let formData = new FormData(form);
        let dataFromForm = [];

        for (let elem of formData){
            dataFromForm.push(elem);
        }

        let dataForSending = {
            name: dataFromForm[0][1],
            theme: dataFromForm[1][1],
            _id: user.user._id,
            words: wordsWithMistakes
        }


        axios.post(server + 'addCollection', dataForSending)
        .then(d => console.log(d))
        .catch(e => console.log(e))
    }

    const addWordsToCollection = (e) => {
        e.preventDefault();
        let form = document.querySelector("#formThemeFromAddWords");
        let formData = new FormData(form);

        let collectionName = formData.get('collectionChoose');

      
        let collection = user.collections.find(collection => collection.name === collectionName)

        let id = collection.words.length + 1;
        
        let wordsToAdd = wordsWithMistakes.map(word => {
            word.id = id;
            id++;
            return word;
        })

        let dataForSending = {
            id: collection._id,
            words: wordsToAdd,
            command: 'add'
        }

        user.collections.forEach(collection => {
            if (collection.name === collectionName) {
                collection.words.push(...wordsToAdd)
            }
        })

        localStorage.setItem('VoC', JSON.stringify(user));


        axios.patch(server + 'changeCollection', dataForSending)
        .then(d => console.log(d))
        .catch(e => console.log(e))

    }

    let bottomPannel =  <div className={styles.addCreateMainContainer}>
        <div className={styles.addCreateBattunsContainer}>
            <button onClick={() => {
                setWhatToDo('add');
                setAddCreateBlock('show');
            }}
                >ADD</button>
            <button onClick={() => {
                setWhatToDo('create');
                setAddCreateBlock('show');
            }}>Create</button>
        </div>
        <div className={addCreateBlock === 'show' ? styles.addCreateBlockDown : (addCreateBlock === 'hide' ? styles.addCreateBlockUp : null)}>
            {
                whatToDo === 'create'
                ?
            <>
                    <form className={styles.formCreateCollection} id="formCreateCollection" onSubmit={e => createCollectionFromForm(e)}>
                        <div>  
                            <input name="collectionName" placeholder="Name of collection" />
                            <select name="colorSelector">
                                <option value="Yellow">Yellow</option>
                                <option value="Green">Green</option>
                                <option value="Purple">Purple</option>
                                <option value="Blue">Blue</option>
                                <option value="Red">Red</option>
                                <option value="Black">Black</option>
                            </select>    
                        </div>
                        <div>
                            <button type="submit" onClick={() => setAddCreateBlock('hide')}></button>
                            <button onClick={() => setAddCreateBlock('hide')}></button>
                        </div>
                    </form>
                    
            </>
                :
                (whatToDo === 'add'
                ?
                <>
                    <form className={styles.formAddCollection} id="formThemeFromAddWords" onSubmit={(e) => addWordsToCollection(e)}>
                        <div>
                            
                            <select name="collectionChoose" onChange={e => currentCollection(e)}>
                                {collectionsNames}
                            </select>
                            
                        </div>
                       <div>
                            <button type="submit"  onClick={() => setAddCreateBlock('hide')}/>
                            <button onClick={() => setAddCreateBlock('hide')}/>
                       </div>
                    </form>
                    
                </>
                :
                null
                )
            }
        </div>
    </div>


    let wordsForTrainingFirstPart = []; 

    wordsForTrainingFirstPart = [...wordsWithMistakes, ...wordsWithMistakes, ...wordsWithMistakes, ...wordsWithMistakes, ...wordsWithMistakes];

    let wordsForTrainingThirdPart = [];
    
    wordsWithMistakes.map(word => {
        return  wordsForTrainingThirdPart.push([word.eng, word.ukr], [word.ukr, word.eng], [word.eng, word.ukr], [word.ukr, word.eng]);
    })

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    

    shuffleArray(wordsForTrainingFirstPart);
    shuffleArray(wordsForTrainingThirdPart);

    let wordsForTrainingSecondPart = shuffleArray(wordsForTrainingFirstPart);



    let mistakes = <div className={styles.mistakesListContainer}>
            <ol>
              {wordsWithMistakesList}
            </ol>
        {bottomPannel}
        <button className={styles.mistakesListContainer__startTraining} onClick={() => setStage('training')}>Start training!</button>
        <div onClick={() => navigate('/userPage/training')} className={styles.buttonCloseTrainingField}><span></span><span></span></div>
    </div>
    
    



    const shownStage = () => {
        switch (stage){
            case 'setings':
                return <Settings
                currentCollectionChoice={currentCollectionChoice}
                setCurrentCollectionChoice={setCurrentCollectionChoice}
                wordsWithMistakes={wordsWithMistakes}
                setWordsWithMistakes={setWordsWithMistakes}
                words={words}
                setWords={setWords}
                setStage={setStage}
                collectionsNames={collectionsNames}
                currentCollection={currentCollection}
                />
            case 'generalTest':
                return generalTest;
            case 'wrongWords':
                return mistakes;
            case 'training':
                return <TrainingWithWords 
                wordsWithMistakes={wordsWithMistakes}
                wordsForTrainingFirstPart={wordsForTrainingFirstPart}
                wordsForTrainingSecondPart={wordsForTrainingSecondPart}
                wordsForTrainingThirdPart={wordsForTrainingThirdPart}
                server={server} 
                site={site}
                />
            default: 
                break;
        }
            
    }

    return <div className={styles.mainWindow} >
            {shownStage()}
            <ToastContainer className={styles.Toastify__toast__container}
                position="top-center"
                autoClose={1000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                limit={1}
                pauseOnFocusLoss
                draggable
                theme="light"
            />
    </div>
}