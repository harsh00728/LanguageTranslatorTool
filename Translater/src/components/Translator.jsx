import { useState } from "react";
import languages from "../languages.jsx";

function Translator(){
    const [loading, setLoading]= useState(false);
    const [fromText, setFromText]= useState("");
    const [toText, setToText]= useState("");
    const [fromLang, setFromLang]= useState("en-GB");
    const [toLang, setToLang]= useState("hi-IN");

    const handleFromLang= (event)=> {
        setFromLang(event.target.value)
    }

    const handleToLang= (event)=> {
        setToLang(event.target.value)
    }

    const handleExchange= ()=> {
        let tempValue= fromText;
        setFromText(toText);
        setToText(tempValue);

        let tempLang= fromLang;
        setFromLang(toLang);
        setToLang(tempLang);
    }

    const handleFromText= (event)=> {
        setFromText(event.target.value);
    }

    const handleIconClick= (target, id)=> {
        if(target.classList.contains('fa-copy')) {
            if(id == 'from'){
                copyContent(fromText);
            }else {
                copyContent(toText);
            }
        }else {
            if(id == 'from'){
                utterText(fromText, fromLang);
            } else{
                utterText(toText, toLang);
            }
        }
    }

    const copyContent= (text)=> {
        navigator.clipboard.writeText(text);
    }

    const utterText= (text, lang)=> {
        const synth= window.speechSynthesis;
        const utterance= new SpeechSynthesisUtterance(text);
        utterance.lang= lang;
        synth.speak(utterance);
    }

    const handleTranslate= async ()=> {
       try{
        setLoading(true);
        const URL= `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLang}|${toLang}` ;
        let response= await fetch(URL);
        let jsonResponse= await response.json();
        setToText(jsonResponse.responseData.translatedText);
        setLoading(false);

       } catch(err){
            throw err;
       }
    }


    return (
        <>
            <div className="wrapper">
                <div className="text-input">
                    <textarea className="from-text" name="from" id="from" placeholder="Enter Text" value={fromText} onChange={handleFromText} ></textarea>
                    <textarea className="to-text" name="to" id="to" readOnly value={toText} ></textarea>
                </div>

                <ul className="controls">
                        <li className="row from">
                            <div className="icons">
                                <i id="from" class="fa-solid fa-volume-high" onClick={ (event)=> handleIconClick(event.target, 'from')} ></i>
                                <i id="from" class="fa-regular fa-copy" onClick={ (event)=> handleIconClick(event.target, 'from')} ></i>
                            </div>
                            <select value={fromLang} onChange={handleFromLang} >
                                {
                                    Object.entries(languages).map( ([code, name])=>(
                                        <option key={code} value={code}>{name}</option>
                                    ))
                                }
                            </select>
                        </li>

                        <li className="exchange" onClick={handleExchange} >
                            <i class="fa-solid fa-arrow-right-arrow-left"></i>
                        </li>

                        <li className="row to">
                            <select value={toLang} onChange={handleToLang} >
                                {
                                    Object.entries(languages).map( ([code, name])=>(
                                        <option key={code} value={code}>{name}</option>
                                    ))
                                }
                            </select>
                            <div className="icons">
                                <i id="to" class="fa-regular fa-copy" onClick={ (event)=> handleIconClick(event.target, 'to')}></i>
                                <i id="to" class="fa-solid fa-volume-high" onClick={ (event)=> handleIconClick(event.target, 'to')}></i>
                            </div>

                        </li>
                    </ul>

            </div>
            <button onClick={handleTranslate} > { loading? "traslating..." : "Translate Text"} </button>
        </>
    )
}

export default Translator;
