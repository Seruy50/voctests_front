import react, {useState, useEffect} from 'react';
import stylesCollections from './styles/Collections.module.css';
import axios from 'axios';
import AddCollection from './collections/AddCollection.jsx';
import EditCollectionWindow from './collections/EditCollectionWindow.jsx';
import ViewCollectionWindow from './collections/ViewCollection.jsx';



export default function Collections(){
    const [addCollection, setAddCollection] = useState({show: false, phase: '1' , name: '', theme: ''});
    const [editCollection, setEditCollection] = useState({show: false, collectionId: ''});
    const [viewCollection, setViewCollection] = useState({show: false, collectionId: ''});
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("VoC")).user;
        axios.post('https://voctests-back.onrender.com/getCollections', {_id: user._id}).then(data => {
        let local = JSON.parse(localStorage.getItem("VoC"));
        
        local.collections = data.data.collections;      
        localStorage.setItem("VoC", JSON.stringify(local))
        setCollections(data.data.collections)})
        .catch(err => console.log(err))
    }, [])

    const deleteCard = (e) => {
       
        if ( window.confirm('Are you shure?')){
            let user = JSON.parse(localStorage.getItem("VoC")).user;
            axios.post('https://voctests-back.onrender.com/deleteCard', {id: e.target.id, user: user._id}).then((data) => {
            let local = JSON.parse(localStorage.getItem("VoC"));
            local.collections = data.data;      
            localStorage.setItem("VoC", JSON.stringify(local))
            setCollections(data.data)
            }).catch(err => console.log(err))
        }
       
    }
    
    return <div className={stylesCollections.mainBlock}> 
        <div  className={stylesCollections.addButtonContainer}>
            <button className={stylesCollections.buttonAdd} onClick={() => setAddCollection({...addCollection, show: true, phase: '1'})}>Add</button>
        </div>
            {
                addCollection.show 
                ? 
                <div className={stylesCollections.addWindowContainer}>
                    <AddCollection setCollections={setCollections} addCollection={addCollection} setAddCollection={setAddCollection}/> 
                </div>:
                null
            }
        <div className={stylesCollections.collections}>
            {collections.map(collection => {
                return <div key={collection._id} className={stylesCollections.collectionCard} style={{backgroundColor:collection.theme, borderColor: collection.theme}}> 
                            <div>
                                <p className={stylesCollections.collectionCardName}>{collection.name}</p>
                                <div className={stylesCollections.collectionCardButtons}>
                                    <button 
                                        onClick={() => setViewCollection({...editCollection, show: true, collectionId: collection._id})}
                                            >View</button>
                                    <button onClick={() => {
                                        setEditCollection({...editCollection, show: true, collectionId: collection._id});
                                        console.log(editCollection);
                                        }}>Edit</button>
                                    <button id={collection._id} onClick={(e) => deleteCard(e)}>Delete</button>
                                </div>
                            </div>
                </div>
            })}
            {editCollection.show 
                ? 
                <div className={stylesCollections.addWindowContainer}>
                    <EditCollectionWindow editCollection={editCollection} setEditCollection={setEditCollection}/> 
                </div>
                : 
                null}
            {viewCollection.show 
                ? 
                <div className={stylesCollections.addWindowContainer} >
                    <ViewCollectionWindow viewCollection={viewCollection} setViewCollection={setViewCollection}/> 
                </div>
                : 
                null}
        </div>
    </div>
}
