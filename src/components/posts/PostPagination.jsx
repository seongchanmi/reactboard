import React from 'react';
import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

function PostPagination({ page, totalPages, onPrev, onNext, logined }) {
    return (
        <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{ mt: 1 }}>

            {/* 페이지네이션 */}
            <Stack direction='row' alignItems='center' spacing={1.6}>

                <Button variant='outlined' size="small"
                    disabled={page == 0}
                    onClick={onPrev}
                >이전</Button>

                <Typography variant='body2'>
                    {page + 1} / {totalPages}
                </Typography>

                <Button variant='outlined' size="small"
                    disabled={page + 1 >= totalPages}
                    onClick={onNext}
                >다음</Button>

            </Stack>

            {/* 새 글 작성 버튼 */}
            { 
            logined && <Button component={Link} to='/posts/new' variant='outlined' size='small' sx={{ borderRadius: 999, color: '#937' }}>새 글 작성</Button>
            }
        
        </Stack>
    );
}

export default PostPagination;