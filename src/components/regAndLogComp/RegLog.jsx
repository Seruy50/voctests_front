import React, { useState } from "react";
import stylesRegLog from "../styles/RegLog.module.css";
import stylesMain from "../styles/main.module.css";
import InformationWindow from "./InfoWindow.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import { useNavigate } from "react-router-dom";

export default function RegLogForm({ logged }) {
  const [infoWindow, setInfoWindow] = useState();
  const [emailConfirmation, setEmailConfirmation] = useState();
  const navigate = useNavigate();

  return (
    <div className={stylesMain.boxForForms}>
      
      <InformationWindow infoWindow={infoWindow} 
                         setInfoWindow={setInfoWindow}
                         emailConfirmation={emailConfirmation}
                         setEmailConfirmation={setEmailConfirmation}/>
      <div className={stylesRegLog.formBlock}>
        {
          logged 
            ?
          <button className={stylesRegLog.buttonBackToProfile} onClick={() => navigate('/userPage/collections')}>Back to pforile</button>
            :
          <RegistrationForm setInfoWindow={setInfoWindow}
                          setEmailConfirmation={setEmailConfirmation}
                          />
        }
      </div>
    </div>
  );
}

