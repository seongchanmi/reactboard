import React from 'react';
import { Box, Button } from "@mui/material";

function PostFormSubmit({ isEdit }) {

    return (
        <Box sx={{ display:'flex', justifyContent: 'flex-end'}}>
            <Button type="submit" variant='contained' size='small' sx={{ borderRadius: 999, px: 3, fontWeight: 500, color: 'primary'}} >
                { isEdit ? "수정" : "등록"}
            </Button>
            
        </Box>
    );
}

export default PostFormSubmit;