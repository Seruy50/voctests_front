import React, {useState} from 'react';
import styles from './styles/Vocabluary.module.css';
import axios from 'axios'

export default function Vocabluary(){
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [sortMethod, setSortMethod] = useState('Alphabet(A-Z)')

    const [img, setImg] = useState();
    

    let collections = JSON.parse(localStorage.getItem('VoC')).collections;

    let collectionsList = collections.map(collection => <option key={collection._id}>{collection.name}</option>)
    let wordsList = [];
    
    if (selectedCollections.includes('All') || selectedCollections.length === 0){
        collections.map(collection => {
            collection.words.map(word => {
                word.collectionName = collection.name;
                return wordsList.push(word)
            })
        })
    } else {
        selectedCollections.map(collectionName => {
            collections.map(collection => {
                if(collection.name === collectionName){
                    collection.words.map(word => {
                        word.collectionName = collection.name;
                        return wordsList.push(word)
                    })
                } 
            })
        })
    }
    
    const sortFunction = () => {
        
        switch(sortMethod){
            case 'Alphabet(A-Z)':
                wordsList.sort((a, b) => {
                    if (a.eng > b.eng){
                        return 1
                    } else if (a.eng < b.eng){
                        return -1;
                    } else {
                        return 0;
                    }
                })
                break;
            case 'Alphabet(Z-A)':{
                wordsList.sort((a, b) => {
                    console.log(a)
                    if (b.eng > a.eng){
                        return 1
                    } else if (b.eng < a.eng){
                        return -1;
                    } else {
                        return 0;
                    }
                })
                break;
            }
            case 'Collection name':{
                wordsList.sort((a, b) => {
                    console.log(a)
                    if (a.collectionName > b.collectionName){
                        return 1
                    } else if (a.collectionName < b.collectionName){
                        return -1;
                    } else {
                        return 0;
                    }
                })
                break;
            }
            case 'Part of language':{
                wordsList.sort((a, b) => {
                    console.log(a)
                    if (a.part > b.part){
                        return 1
                    } else if (a.part < b.part){
                        return -1;
                    } else {
                        return 0;
                    }
                })
                break;
            }
            default:
                break;
        }
        
    }

    sortFunction();

    wordsList = wordsList.map(word => <li><b>{word.eng.toUpperCase()}</b> - {word.ukr}{` (`}<i><span>{word.part}</span></i>{`)`} /<span>{word.collectionName}</span>/</li>)
  

    const selectedCollectionsFunc = (e) => {
        let selected = [];

        for(let i = 0; i < e.target.selectedOptions.length; i++){
           selected.push(e.target.selectedOptions[i].innerText)
        }

        if (selected.includes('All')) selected = ['All']

        setSelectedCollections([...selected]);
    }

   
   

    const sendFile = async () => {
        try{
            const data = new FormData()
            data.append('avatar', img)

            console.log(data)

            await axios.post('http://localhost:3001/uploadImage', data, {
                headers: {
                    'content-type': "multipart/form-data"
                }
            }).then(d => console.log(d))
        } catch (error) {
            
        }
    }

    

      async function downloadFile2(file){
            let response = await fetch('http://localhost:3001/download')
            const slo = await response.blob();
            console.log(slo);
            const URsL = window.URL.createObjectURL(slo);
            const link = document.createElement('a');
            link.href = URsL;
            link.download = 25;
            document.body.appendChild(link);
            link.click();
            link.remove();
                
    }

    

    return <div className={styles.vocabluaryMainBlock}>
        <div className={styles.vocabluarySetings}>
            <form name="collections" className={styles.vocabluarySetingsCollections}>
                <label>
                    Show collections:
                </label>
                <select multiple={true} onChange={(e) => {
                    
                    selectedCollectionsFunc(e)
                    }}>
                    <option>All</option>
                    {collectionsList}
                </select>
            </form>
            
            <form name="sorting" className={styles.vocabluarySetingsSorting} onChange={(e) => setSortMethod(e.target.value)}>
                <label>Sort by:</label>
                <select>
                    <option value="Alphabet(A-Z)">Alphabet(A-Z)</option>
                    <option value="Alphabet(Z-A)">Alphabet(Z-A)</option>
                    <option value="Collection name:">Collection name</option>
                    <option value="Part of language">Part of language</option>
                </select>
            </form>


            <input type="file" onChange={e => setImg(e.target.files[0])}/>
            <button onClick={() => sendFile()}>Send</button>

           

        </div>
        <div className={styles.vocabluaryWordlsListContainer}>
            <ol >
                {wordsList}
            </ol>
        </div>
    </div>
}