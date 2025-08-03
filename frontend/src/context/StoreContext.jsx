import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext=createContext(null)

const StoreContextProvider=(props)=>{
    const url="https://socialhub-backend-wmce.onrender.com";
    const [token,setToken]=useState("");
    const [post_list,setPostList]=useState([])


    const fetchPostList=async()=>{
        const response=await axios.get(url+"/api/post/list");
        setPostList(response.data.data)
    }
    
    useEffect(()=>{
        async function loadData(){
            await fetchPostList();
            if(localStorage.getItem("token")){
              setToken(localStorage.getItem("token"));
        }
        }
        loadData();

    },[])

    const contextValue ={
        food_list,
        url,
        token,
        setToken,
    }
    
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
