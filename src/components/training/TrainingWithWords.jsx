import react, {useState, useEffect} from 'react';
import styles from '../styles/Training.module.css'


export default function TrainingWithWords(props){
    const [answer, setAnswer] = useState();
    const [counter, setCounter] = useState([0, 0]);
    const [result, setResult] = useState('grey');
    const [stage, setStage] =  useState('first');
    const [showButtonNext, setShowButtonNext] = useState({block: 'block', button: 'none'});
    const [mistakes, setMistakes] = useState(0);
    const [statistics, setStatistics] = useState({first: {time: 0, mistakes: 0}, second: {time: 0, mistakes: 0}, third: {time: 0, mistakes: 0}, all: {time: 0, mistakes: 0}})
    const [start, setStart] = useState();

    useEffect(() => {
        setStart(new Date())
    }, [setStart])

    const checkAnswer = (what) => {
        let arrayWithWords = props.wordsForTrainingFirstPart[counter[0]].ukr.split(', ');
        let changes = counter;
        switch(what){
            case 'eng':
                if (arrayWithWords.includes(answer)){
                    if (counter[0] === props.wordsForTrainingFirstPart.length - 1) {
                        changes[0] = 0;
                        calculateCurrentStats();
                        goToNewRound();
                       
                    } else {
                        changes[0] = +changes[0] + 1;
                    }
                    setAnswer('')
                } else {
                    setResult('red');
                    setMistakes(+mistakes+ 1)
                }
                
            break;
            case 'ukr':
                if (answer === props.wordsForTrainingSecondPart[counter[0]].eng){
                    if (counter[0] === props.wordsForTrainingSecondPart.length - 1) {
                        changes[0] = 0;
                        calculateCurrentStats();
                        goToNewRound()
                    } else {
                        changes[0] = +changes[0] + 1;
                    }
                    setAnswer('')
                } else {
                    setResult('red');
                    setMistakes(+mistakes+ 1)
                }
            break;
            case 'last':
                if (props.wordsForTrainingThirdPart[counter[0]][1].split(', ').includes(answer)){
                    if (counter[0] === props.wordsForTrainingThirdPart.length - 1) {
                        changes[0] = 0;
                        calculateCurrentStats();
                        goToNewRound();
                    } else {
                        changes[0] = +changes[0] + 1;
                    }
                    setAnswer('')
                } else {
                    setResult('red');
                    setMistakes(+mistakes+ 1)
                }
            break;
            default: 
                break;
        }
        setCounter([...changes])
       
        
    }

    const goToNewRound = () => {
        setShowButtonNext({...showButtonNext, block: 'none', button: 'block'});
        setAnswer('');
    }

    const calculateCurrentStats = () => {
        let stat = statistics;
        stat[stage].time = Math.floor((new Date() - start) / 1000);
        stat[stage].mistakes = mistakes;
        stat.all.time = +stat.all.time + stat[stage].time;
        stat.all.mistakes = +stat.all.mistakes + mistakes;
        setStatistics({...stat})
        setStart(new Date());
        setMistakes(0);
        
    }

    const checkWordAndPhase = (e, what) => {
        if(result === 'red'){
            setResult('grey');
            setAnswer('');
            return;
        }

        if(e.keyCode === 13){
            checkAnswer(what);
        } 
    }

    
    let timings = () => {
        return <>
            <p>
                Time:
            </p>
            <p> 
                {
                    statistics[stage].time / 60 < 10
                    ?
                    '0' + Math.floor(statistics[stage].time / 60)
                    :
                    Math.floor(statistics[stage].time / 60)
                }
                :
                {
                    statistics[stage].time % 60 < 10
                    ?
                    '0' + Math.floor(statistics[stage].time % 60)
                    :
                    Math.floor(statistics[stage].time % 60)
                };
            </p>
        </>
    }
    
    const buttonChange = () => {
        let changes = counter;
        setStage(
            stage === 'first' ? 'second' : (stage === 'second' ? 'third' : 'final' )
        )
        setShowButtonNext({...showButtonNext, block: 'block', button: 'none'})
        setResult('grey');
        setAnswer('');
        setCounter(changes)
        setMistakes(0)
        
    }

   

    const createResultsBlock = (stage, statStage) => {

        return <div className={styles.containerForResultsFromStages__stage}> 
                    <p className={styles.containerForResultsFromStages__stage__title}>{stage}</p>  
                    <div>
                        <p>
                            Time: 
                        </p>
                        <p>
                            {
                                statistics[statStage].time / 60 < 10
                                ?
                                '0' + Math.floor(statistics[statStage].time / 60)
                                :
                                Math.floor(statistics[statStage].time / 60)
                            }
                            :
                            {
                                statistics[statStage].time % 60 < 10
                                ?
                                '0' + Math.floor(statistics[statStage].time % 60)
                                :
                                Math.floor(statistics[statStage].time % 60)
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            Mistakes: 
                        </p>
                        <p>
                            {statistics[statStage].mistakes}
                        </p>  
                    </div>
                </div>
    }


    const blockWithButton = () => {
        
        return <div style={{display: showButtonNext.button}} className={styles.currentResultsBoard}>
                    <div>
                        {timings()}
                    </div>
                    <div>
                        <p>
                            Mistakes: 
                        </p>
                        <p>
                            {statistics[stage].mistakes};
                        </p>
                    </div>
                    <button className={styles.buttonNextStage} onClick={() => buttonChange()}>Next</button>
                </div>
    }

    function stages(){
        switch(stage){
            case 'first':
                return <>
                    <p  style={{display: showButtonNext.block}} className={styles.stage}>Stage - I / III</p>
                    <div style={{display: showButtonNext.block}} className={styles.blockWithWords}>
                        <p className={styles.wordToTest}>{props.wordsForTrainingFirstPart[counter[0]].eng.slice(0, 1).toUpperCase() + props.wordsForTrainingFirstPart[counter[0]].eng.slice(1)}</p> 
                        <input className={styles.inputForTraining} value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={(e) => checkWordAndPhase(e, 'eng')} style={{border: '3px solid ' + result, color: result}}/>
                        <p className={styles.counter}>{counter[0] + 1} / {props.wordsForTrainingFirstPart.length}</p>
                    </div>
                    {blockWithButton()}
                    <a href="https://voctests.onrender.com/userPage/training" className={styles.buttonCloseTrainingField}><span></span><span></span></a>
                </>
            case 'second':
                return <>
                    <p style={{display: showButtonNext.block}} className={styles.stage}>Stage - II / III</p>
                    <div style={{display: showButtonNext.block}} className={styles.blockWithWords}>
                        
                        <p className={styles.wordToTest}>{props.wordsForTrainingFirstPart[counter[0]].ukr.slice(0, 1).toUpperCase() + props.wordsForTrainingFirstPart[counter[0]].ukr.slice(1)}</p> 
                        <input className={styles.inputForTraining} value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={(e) => checkWordAndPhase(e, 'ukr')} style={{border: '3px solid ' + result, color: result}}/>
                        <p className={styles.counter}>{counter[0] + 1} / {props.wordsForTrainingFirstPart.length}</p>
                    </div>
                    {blockWithButton()}
                    <a href="https://voctests.onrender.com/userPage/training" className={styles.buttonCloseTrainingField}><span></span><span></span></a>
               </>
            case 'third':
                return <>
                    <p style={{display: showButtonNext.block}} className={styles.stage}>Stage - III / III</p>
                    <div style={{display: showButtonNext.block}} className={styles.blockWithWords}>
                        <p className={styles.wordToTest}>{props.wordsForTrainingThirdPart[counter[0]][0]}</p> 
                        <input className={styles.inputForTraining} value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={(e) => checkWordAndPhase(e, 'last')} style={{border: '3px solid ' + result, color: result}}/>
                        <p className={styles.counter}>{counter[0] + 1} / {props.wordsForTrainingThirdPart.length}</p>  
                    </div>
                    {blockWithButton()}
                    <a href="https://voctests.onrender.com/userPage/training" className={styles.buttonCloseTrainingField}><span></span><span></span></a>
                </>
            case 'final':
                return <div className={styles.finalBlockWithResults}>
                            <p className={styles.wellDoneTitle}>That's all. Well done!</p>
                            <div className={styles.containerForResultsFromStages}>
                                {createResultsBlock('Stage I', 'first')}
                                <hr className={styles.lineBetweenBlocks}/>
                                {createResultsBlock('Stage II', 'second')}
                                <hr className={styles.lineBetweenBlocks}/>
                                {createResultsBlock('Stage III', 'third')}
                            </div>
                            <p className={styles.finalResultpar}>You made it in <span className={styles.finalResultColors}>{Math.floor(statistics.all.time / 60)} minutes</span> and <span className={styles.finalResultColors}>{Math.floor(statistics.all.time % 60)} seconds</span> with <span className={styles.finalResultColors}>{statistics.all.mistakes} mistakes</span>!</p>
                            <a href="https://voctests.onrender.com//userPage/training" className={styles.buttonCloseTrainingField}><span></span><span></span></a>
                </div>
            default: 
                return null;
        }
        
    }

    return <div className={styles.testsMainBlock}>
        {stages()}
    </div>
}