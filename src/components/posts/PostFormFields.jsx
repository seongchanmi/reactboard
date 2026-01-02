import React from 'react';
import { TextField } from "@mui/material";

function PostFormFields({ title, content, onChangeTitle, onChangeContent }) {
    return (
        <>
        {/* material design에서 input의 역할을 하는 게 TextField */}
         <TextField placeholder="제목" size='small'
         value={title}
         onChange={(evt) => onChangeTitle(evt.target.value)} 
         /> 

         <TextField placeholder="내용" size='small'
         value={content}
         onChange={(evt) => onChangeContent(evt.target.value)}  
         multiline
         minRows={8}
         />   
        </>
    );
}

export default PostFormFields;