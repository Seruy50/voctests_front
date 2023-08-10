import react, {useState} from 'react';
import stylesCollections from '../styles/Collections.module.css';


export default function ViewCollection({viewCollection, setViewCollection}){
    let collections = JSON.parse(localStorage.getItem('VoC')).collections;
    let currentCollection = collections.filter(collection => collection._id === viewCollection.collectionId);
   
    let readyWords = currentCollection[0].words.map(word => {
        return <li>
                   <span>
                        {word.eng.toUpperCase() + " - "}  
                   </span>
                   <span>
                        {word.ukr} 
                   </span>
                   <span>
                         /{word.part}/;
                   </span>
                </li>
    })

    return <div className={stylesCollections.viewCollectionMainWindow}>
                
                        <ol>
                            {readyWords}
                        </ol>
                    
                    <div onClick={() => setViewCollection({...viewCollection, show: false})} className={stylesCollections.viewCollectionMainWindowCloseButton}><span></span><span></span></div>
                    
    
</div>
}
