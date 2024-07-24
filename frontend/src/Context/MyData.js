import React, { useContext ,useState,useEffect,createContext} from "react";
import axios from "axios";


const MyContext= createContext()

export const useMyContext=()=>{
    return useContext(MyContext)
}

const MyData=({children})=>{
    const [registeredDrs, setRegisteredDrs]= useState()
    const [toasterMessage, setToasterMessage]= useState("")
    const [severityVal, setSeverityVal]= useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarClose=()=>{
        setSnackbarOpen(false)
        setToasterMessage("");
        setSeverityVal("");
    }
    useEffect(() => {
        if (toasterMessage) {
          setSnackbarOpen(true);
        }
      }, [toasterMessage]);

        const getAllRegisteredDrs=async()=>{
            const config={
            headers:{
                "Content-type":"application/json"
            }
            }
        
            try{
        
            const {data}=await axios.get('/doctors',config)
            setRegisteredDrs(data)
        
            }catch(error){
            console.log(error)
            }
        
        
        }
        
        useEffect(()=>{
            getAllRegisteredDrs()
        },[])


return(

    <MyContext.Provider value={{toasterMessage, setToasterMessage,severityVal, setSeverityVal,snackbarOpen, setSnackbarOpen,handleSnackbarClose,registeredDrs}}>
        {children}
    </MyContext.Provider>
)
}

export default MyData