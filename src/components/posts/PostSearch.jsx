import { Box, Button, TextField } from "@mui/material";
import { TiZoom } from "react-icons/ti";

function PostSearch({ keyword, onSubmit, onChangeKeyword }) {
    return (
        <Box component="form" 
        onSubmit={onSubmit}  // 이 Box 태그는 랜더링이 될 때 form으로 처리될 것임. form이 있기 때문에 onSubmit가 있어야 하구요
        sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5,  }}
        > 
            <TextField type='search' 
            size='small' 
            placeholder='제목 또는 내용 검색' 
            value={keyword}
            onChange={(evt) => onChangeKeyword(evt.target.value)}
            sx={{ width: 620 }}
            />
            <Button type='submit' variant='outlined' size='small' sx={{ borderRadius: 999 }}>
                <TiZoom color= '#937' style={{ fontSize: 20 }} />
            </Button>
        </Box>
        // form을 걸어두면 input이 가지고 있는 속성도 있고, onClick이 없어도 onSubmit가 데이터 값을 전송해준다
    );
}

export default PostSearch;