import React, {useState} from 'react';
import styles from './styles/getWords.module.css';
import axios from 'axios';

export default function GetWords(){
    const [txt, setTxt] = useState('');
    const [downloadButton, setDownloadButton] = useState(true);
    const [wordsFrom, setWordsFrom] = useState();
    let user = JSON.parse(localStorage.getItem('VoC'));
    const [newCollection, setNewCollection] = useState({name: '', theme: '', _id: user.user._id, words: [], show: false, doneButtonShow: true});
    const [text, setText] = useState(true);
    

    const wordsFromFile = () => {
        return <>
             <div className={styles.fieldContainerUpload}>
            <label className={styles.chooseFileContainer}>
                <input className={styles.chooseFile} type="file" onChange={e => {
                    setTxt(e.target.files[0]);
                    console.log(e.target.files);
                }} onClick={(e) => {
                    clearFiles(e);
                    setDownloadButton(true);    
                    }}></input>
            </label>
            <button className={styles.button} disabled={txt ? false : true} onClick={() => sendTxt()}>Send file</button>
        </div> 
        <div className={styles.fieldContainerDownload}>
            <button disabled={downloadButton ? true : false} onClick={e => handleC(e) }>Download</button>
            <button disabled={downloadButton ? true : false} onClick={() => setNewCollection({...newCollection, show: true})}>Create collection</button>
        </div>
        </>
    }

    const wordsFromField = () => {
        
        const submitFunction = (e) => {
            let textFromTextArea = '';
            let collectionName = '';
            let collectionColor = '';

            e.preventDefault();

            const form = document.querySelector("#textSubmit")

            const data = new FormData(form);

            for(let elem of data.entries()){
                console.log(elem)
               switch (elem[0]){
                case 'textArea':
                    textFromTextArea = elem[1];
                    break;
                case 'collectionName':
                    collectionName = elem[1];
                    break;   
                case 'colorSelector':
                    collectionColor = elem[1];
                    break;  
                default:
                    break;     
               }
            }

            let array = textFromTextArea.split(' '); 

            let clearArray = array.map(data => {
                if(
                    data.match(/[A-Za-zА-Яа-я]/)              
                    && 
                    !data.match(/\—|\’|\@|\*|\#|\$|\^|\&|\_|\d|\s/g)
                ){
                    data = data.split('');
                    
                    let word = data.filter(letter => {   
                       
                        if (!letter.match(/,|\.|\?|"|'|\(|\)|\[|\]|\{|\}|»|«/)){
                            
                            return  letter ? letter : null;
                        }
                    })

                    word = word.join('');

                    word = word.slice(0, 1).toUpperCase() + word.slice(1);
                    
                    return word;
            }})

            clearArray = Array.from(new Set(clearArray));
            clearArray = clearArray.filter(word => word !== undefined)
            
            let id = 0;
            let words = clearArray.map(word => {
                ++id
                return {id: id, eng: word, ukr: '', part: 'none'}
            })

            let dataForServer = {
                name: collectionName,
                theme: collectionColor,
                words: words,
                _id: user.user._id
            }

            console.log(user.user._id)

            axios.post('https://foodshop-back.onrender.com/addCollection', dataForServer)
            .then(d => console.log(d))
            .catch(e => console.log(e))

            
        }

        return <form id="textSubmit"  onSubmit={e => submitFunction(e)} className={styles.wordsFromFieldContainer}>
                    <p>Copy or enter text in the field below:</p>
                    <textarea name="textArea"></textarea>
                    <div>
                        <label>Collection name:<br/>
                            <input name="collectionName" className={styles.wordsFromFieldContainer_input} />
                        </label>
                        <label>Collection style:<br />
                            <select name="colorSelector" className={styles.wordsFromFieldContainer_input}>
                                <option value="green" style={{backgroundColor: 'green'}}>Green</option>
                                <option value="red" style={{backgroundColor: 'red'}}>Red</option>
                                <option value="blue" style={{backgroundColor: 'blue'}}>Blue</option>
                                <option value="purple" style={{backgroundColor: 'purple'}}>Purple</option>
                                <option value="yellow" style={{backgroundColor: 'yellow'}}>Yellow</option>
                                <option value="black" style={{backgroundColor: 'black'}}>Black</option>
                            </select>
                        </label>
                    </div>
                    <button type="submit" form="textSubmit">Create!</button>
            </form>
        
    }

    const sendTxt = async () => {
        try {
            const data = new FormData();

            data.append('text', txt);

            await axios.post('https://foodshop-back.onrender.com/uploadText', data, {
                headers: {
                    'content-type': "multipart/form-data"
                }
            }).then(data => {
                console.log(data);
                console.log(typeof data.data)
                let words = data.data.split(', ');
                
                words = words.map((word, index) => {
                    if (word) {
                        return {id: index + 1, eng: word, ukr: '', part: 'none'}
                    }
                });

                words = words.filter(word => !!word)

                setNewCollection({...newCollection, words})

                if(data.data){
                    setDownloadButton(false);
                }
            })

            setTxt('');
        } catch (error) {
            console.log(error)
        }
    }

    async function downloadFile(){
        axios.post('https://foodshop-back.onrender.com/download')
        .then(data => {
            const slo = new Blob([data.data], {type: 'text/plain'});
            
            const URsL = window.URL.createObjectURL(slo);

            const link = document.createElement('a');

            link.href = URsL;

            link.download = 25;

            document.body.appendChild(link);

            link.click();

            link.remove();
        })   
        setDownloadButton(true)       
    }   

    async function handleC(e){
        e.stopPropagation();
        downloadFile();
    }

    const clearFiles = (e) => {
        e.target.value = '';
    }

    const createCollection = () => {

        const addToAll = () => {
            
            let collection = {...newCollection};
            delete collection.show;
            console.log(collection)
            axios.post('https://foodshop-back.onrender.com/addCollection', collection)
            .then(d => console.log(d))
            .catch(e => console.log(e))
        }

        const doneAvialiable = (e) => {
            console.log(newCollection)
            setNewCollection({...newCollection, name: e.target.value});
            e.target.value.length > 0 ? setNewCollection({...newCollection, doneButtonShow: false}) : setNewCollection({...newCollection, doneButtonShow: true})
        }

        return <div className={styles.createCollecction__container}>
                    <label>
                        Collection name: 
                    </label>
                    <input onChange={(e) => doneAvialiable(e)}/>
                   
                    <div className={styles.addCollectionTheme}>
                        <p>Collection theme:</p>
                        <div onClick={(e) => setNewCollection({...newCollection, theme: e.target.value})}>
                            <button style={{"backgroundColor": "red"}} value="red"></button>
                            <button style={{"backgroundColor": "green"}} value="green"></button>
                            <button style={{"backgroundColor": "purple"}} value="purble"></button>
                            <button style={{"backgroundColor": "blue"}} value="blue"></button>
                            <button style={{"backgroundColor": "yellow"}} value="yellow"></button>
                            <button style={{"backgroundColor": "black"}} value="black"></button>
                        </div>
                    </div>
                    <div className={styles.addCollectionButtons}>
                        <button onClick={() => {
                            addToAll();
                            setNewCollection({...newCollection, show: false, doneButtonShow: true})
                            }} 
                            disabled={newCollection.doneButtonShow}>Done</button>
                        <button onClick={() => setNewCollection({...newCollection, show: false})}>Cancel</button>
                    </div>
                </div>
    }


    return <>
         <div className={styles.getWordsChooseMethod__container}>
                    <p><span className={text ? styles.getWordsChooseMethod__span_active : styles.getWordsChooseMethod__span} onClick={() => setText(true)}>TEXT</span > / <span className={!text ? styles.getWordsChooseMethod__span_active : styles.getWordsChooseMethod__span} onClick={() => setText(false)}>FILE</span></p>
        </div>
         <div className={styles.getWordsMain}>
               {newCollection.show ? createCollection() : (text ? wordsFromField() : wordsFromFile())}
        </div>
    </>
}