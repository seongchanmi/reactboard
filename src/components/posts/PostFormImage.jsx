import React from 'react';
import { Box, Button, Stack, Typography } from "@mui/material";

function PostFormImage({ onChangeImage, uploading, imageName }) {
    return (
        <Box>
            <Stack direction='row' alignItems='center' spacing={2} mb={1}>
                <Button variant='outlined' component='label' size='small' disabled={uploading}>
                    이미지 선택
                    <input type='file' accept='image/*' hidden onChange={onChangeImage} />
                    {/* accept='image/*' -> 이미지에 해당되는 타입 모든 것들 */}
                    {/* .png, .jpg, .jpeg  이런식으로 넣어도 되긴 함 */}
                    {/* hidden을 하면 못생긴 버튼이 사라짐 */}
                </Button>
                {uploading && <Typography variant='body2'>업로드 중...</Typography>}
                {!uploading && imageName && <Typography variant='body2'>{imageName}</Typography>}
                {/* 위의 코드: "업로드가 끝났고 이미지 이름이 있으면, 이미지 이름 보여주기" */}
            </Stack>
        </Box>
    );
}

export default PostFormImage;