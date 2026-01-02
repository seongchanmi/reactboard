import React from 'react';
import { Box, Divider, Typography } from "@mui/material";

function PostDetailContent({ post, apiBasic }) {

    const { content, imageUrl, title } = post;
    const imageSrc = imageUrl ? `${apiBasic}${imageUrl}` : null;

    return (
        <>
        {
            imageSrc && (
                <Box sx={{ mb: 1.5 }}>
                    <img src={imageSrc} alt={title} style={{ maxWidth: 400, display: 'block' }} /> 
                    {/* alt는 대체텍스트 */}
                </Box>
            )
        }

        <Typography sx={{ p:2, lineHeight: 1.6, mb: 4 }}>
            {content}
        </Typography>

        <Divider sx={{ my: 2 }} />
        </>
    );
}

export default PostDetailContent;