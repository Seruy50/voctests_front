import React, {useState} from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import stylesRegLog from "../styles/RegLog.module.css";
import {useNavigate} from 'react-router-dom'

export default function RegistrationForm(props){
    const {setInfoWindow, setEmailConfirmation} = {...props}
    const [nextForm, setNextForm] = useState("Log in");
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
    const navigate = useNavigate();

    return <form
    className={stylesRegLog.form}
    style={
      nextForm === "Log in"
        ? { height: 450 + "px" }
        : { height: 200 + "px" }
    }
    onSubmit={handleSubmit((data) => {
      if (nextForm === "Log in") {
        axios
          .post("http://localhost:3001/registration", data)
          .then((data) => {
            setEmailConfirmation({
              user: data.data.user,
              code: data.data.code,
            });
          })
          .catch((err) => setInfoWindow(err.response.data));
      } else if (nextForm === "Registration") {
        let loginData = { login: data.login, password: data.password };
        axios
          .post("http://localhost:3001/login", loginData)
          .then((data) => {
            if (data.data === "Wrong") {
              setInfoWindow(data.data);
            } else {
              let user = { 
                          token: data.data.token,
                          user: data.data.user,
                          };

              localStorage.setItem("VoC", JSON.stringify(user));
              navigate('/userPage/collections');
            }
          })
          .catch((err) => console.log(err));
      }
    })}
  >
    <label>Login:</label>
    <input
      type="text"
      {...register("login", {
        required: true,
        maxLength: 15,
        minLength: 5,
        pattern: /^[a-zA-Z](.[a-zA-Z0-9_-]*)$/,
      })}
    />
    {errors?.login?.type === "required" && (
      <p className={stylesRegLog.warning}>Please, enter login!</p>
    )}
    {errors?.login?.type === "maxLength" && (
      <p className={stylesRegLog.warning}>
        Login can not be longer than 15 symbols!
      </p>
    )}
    {errors?.login?.type === "minLength" && (
      <p className={stylesRegLog.warning}>
        Login can not be shorter than 5 symbols!
      </p>
    )}
    {errors?.login?.type === "pattern" && (
      <p className={stylesRegLog.warning}>
        Use only latin letters, digits (not at start) or "_"!
      </p>
    )}

    <label>Password:</label>
    <input
      type="password"
      {...register("password", { required: true, minLength: 8 })}
    />
    {errors?.password?.type === "required" && (
      <p className={stylesRegLog.warning}>Please, enter password!</p>
    )}
    {errors?.password?.type === "minLength" && (
      <p className={stylesRegLog.warning}>
        Password can not be shoter than 8 symbols!
      </p>
    )}

    {nextForm === "Log in" ? (
      <>
        <label>Email:</label>
        <input type="email" {...register("email", { required: true })} />
        {errors?.email?.type === "required" && (
          <p className={stylesRegLog.warning}>Please, enter email!</p>
        )}

        <label>Full Name:</label>
        <input
          type="text"
          {...register("fullName", {
            required: true,
            pattern: /^[a-zA-Zа-яА-Я ]+$/,
          })}
        />
        {errors?.fullName?.type === "required" && (
          <p className={stylesRegLog.warning}>Please, enter name!</p>
        )}
        {errors?.fullName?.type === "pattern" && (
          <p className={stylesRegLog.warning}>
            Only latin and cyrillic letters allowed!
          </p>
        )}
      </>
    ) : (
      ""
    )}
    <p className={stylesRegLog.buttons}>
      <button className={stylesRegLog.button} type="submit">
        {nextForm === "Log in" ? "Create account" : "Sign in"}
      </button>
      <button
        className={stylesRegLog.button}
        type="button"
        onClick={() => {
          setNextForm(nextForm === "Log in" ? "Registration" : "Log in");
        }}
      >
        {nextForm}
      </button>
    </p>
  </form>
}