import React from 'react'

const SucessAlertHanna = ({message}) => {
    
    return (
        <div>


            <div className="alert alert-success" style={{width:"300px",height:"40px",textAlign:"center", background:"#5D1CAA",position:"fixed",top:"10%",left:"38%"}}>
                <p style={{ color:"white"}}>{message}</p>
            </div>

        </div>
    )
}

export default SucessAlertHanna
