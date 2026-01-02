import React from 'react';
import { Box, Chip, Divider, Typography } from "@mui/material";
import dayjs from "dayjs";

function PostDetailHeader({ post }) {
    const { title, readCount, createdAt, updatedAt, author } = post;

    return (
        <>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1.5 }}>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5}}>
                <Typography variant='body2' sx={{ color: '#666' }}>
                    작성자:
                </Typography>

                <Chip label={author.nickname} variant='filled' size='small' sx={{ ml: 0.5, px: 1.5, borderRadius: 999, bgcolor: 'secondary.main', color: '#fff' }} />

                <Typography variant='body2' sx={{ color: '#666', ml: 5 }}>조회수: { readCount }</Typography>
            </Box>

            <Typography variant='caption' sx={{ color: '#666' }}>
                작성일 : { dayjs(createdAt).format('YY년 MM월 DD일 HH:mm') } 
                { updatedAt && <> | 수정일: { dayjs(updatedAt).format('YY년 MM월 DD일 HH:mm') } </>}
            </Typography>

            <Divider sx={{ my: 2 }} />
        </>
    );
}

export default PostDetailHeader