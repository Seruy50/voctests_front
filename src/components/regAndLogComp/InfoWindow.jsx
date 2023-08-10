import React, {useState} from 'react';
import styles from "../styles/RegLog.module.css";
import axios from 'axios'

export default function InformationWindow(props){
    const {infoWindow, setInfoWindow, emailConfirmation, setEmailConfirmation} = {...props}
    const [confirm, setConfirm] = useState("");
    
    function showWindow() {
        if (infoWindow) {
          let infoType;
          if (typeof infoWindow === "object") {
            infoType = Object.keys(infoWindow).join();
          } else {
            infoType = infoWindow;
          }
    
          if (infoType === "login") {
            return (
              <p>Sorry, such LOGIN already exist. Please, choose another login.</p>
            );
          } else if (infoType === "email") {
            return (
              <p>Sorry, such EMAIL already exist. Please, choose another email.</p>
            );
          } else if (infoType === "Wrong") {
            return <p>Wrong LOGIN or PASSWORD!</p>;
          } else if (infoType === "Activated") {
            return <p>Email confirmed, account activated! Now you can log in!</p>;
          }
        }
    
        if (emailConfirmation) {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(
                    "https://voctests-back.onrender.com/registration/confirm",
                    emailConfirmation
                  )
                  .then(() => {
                    setEmailConfirmation("");
                    setInfoWindow("Activated");
                  })
                  .catch((err) => console.log(err));
              }}
            >
              <label>We send code on your email. Please enter it here:</label>
              <input
                type="number"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                }}
              />
              {+confirm === emailConfirmation.code ? (
                <button type="submit" className={styles.button}>
                  Confirm
                </button>
              ) : null}
            </form>
          );
        }
      }
    

    return <div
    className={styles.mistake}
    style={
      !infoWindow && !emailConfirmation
        ? { display: "none" }
        : { display: "block" }
    }
    onClick={() => {
      setInfoWindow("");
    }}
  >
    <div className={styles.mistakeWindow}>
      {showWindow()}
      {!emailConfirmation ? (
        <button
          className={styles.button}
          onClick={() => {
            setInfoWindow("");
          }}
        >
          Understood
        </button>
      ) : null}
    </div>
  </div>
}