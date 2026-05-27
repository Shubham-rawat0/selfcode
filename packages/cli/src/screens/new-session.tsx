import { useLocation, useNavigate } from "react-router";
import { useTheme } from "../providers/theme";
import { useEffect } from "react";
import { BotMessage, ErrorMessage, UserMessage } from "../components/messages";
import { SessionShell } from "../components/session-shell";

export function NewSession () {
    const navigate =useNavigate()
    const location = useLocation()

    const state= location.state as {message?:string}|null

   useEffect(()=>{ 
    if (!state?.message){
        navigate("/",{replace:true})
    }
    },[state,navigate])

    if(!state?.message) return null

    return (
        <SessionShell onSubmit={()=>{}} inputDisabled loading>
            <UserMessage message={state.message}/>
            <BotMessage
            content="Demo content"
            model="opus-4-6"/>
            <ErrorMessage message="Oops error"/>
        </SessionShell>
    )
}