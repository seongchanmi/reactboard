import { Button, Stack } from "@mui/material";
import { Link } from "react-router";

function PostDetailButtons({ id, deleteMutation, loginedEdit }) {
    return (
        <Stack direction='row' spacing={1.5} justifyContent='space-between' alignItems='center' sx={{ mt:1 }}>
            <Button component={Link} to="/posts" variant="outlined" size="small" sx={{ borderRadius: 999, px: 2.5 }}>목록</Button>

            {
                loginedEdit && (
                    <Stack direction='row' spacing={1.5}>
                        <Button component={Link} to={`/posts/${id}/edit`} variant="outlined" size="small" sx={{ borderRadius: 999, px: 2.5 }}>수정</Button>

                        <Button variant="contained" size="small" sx={{ borderRadius: 999, px: 2.5, bgcolor: 'red' }} disabled={deleteMutation.isPending} onClick={() => {
                            if (window.confirm('삭제하시겠습니까?')) deleteMutation.mutate();
                        }}
                        >삭제</Button>
                    </Stack>
                )
            }
        </Stack>
    );
}

export default PostDetailButtons;