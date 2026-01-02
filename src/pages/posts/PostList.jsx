import { Box, Paper, Typography } from '@mui/material'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react';
import { fetchPosts } from '../../api/postsApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import PostSearch from '../../components/posts/PostSearch';
import PostTable from '../../components/posts/PostTable';
import PostPagination from '../../components/posts/PostPagination';
import { useMe } from '../../hooks/useMe';



function PostList() {

    // 페이지내이션. page 상태 관리
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState('');

    const apiBasic = import.meta.env.VITE_API_BASE_URL;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', page, keyword], // page, keyword가 바뀌면 새로운 데이터를 가ㅈㅕ옴
        queryFn: () => fetchPosts({ page, size: 10, keyword }),
        placeholderData: keepPreviousData // 페이지 전환시(혹은 이동시) 기존 데이터 유지. 
    });

    const { data: me, isLoading: meIsLoading } = useMe();

    if (isLoading) return <Loader />;
    if (isError) return <ErrorMessage error={error} />;

    const { content, totalPages } = data;

    // 이벤트 핸들러=======================================================================================

    // 검색
    const handleSearch = (evt) => {
        evt.preventDefault();
        setPage(0); // 맨 처음 페이지로 돌아오게끔 하고 싶을 때는 이 코드 작성
    }

    // 이전 페이지 이동 
    const handlePrev = () => {
        setPage(prev => Math.max(prev - 1, 0)); // 0보다 작아지지 않게 해줌
    }

    // 다음 페이지 이동
    const handleNext = () => {
        setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));
        // setPage(page + 1); 로 작성하면 안됨
    }

    return (
        <Box sx={{
            // minHeight: '100vh'
        }}>
            <Paper elevation={2} sx={{
                width: '100%',
                borderRadius: 3,
                px: 2,
                py: 1,
                boxShadow: '0 16px 40px rgba(0,0,0, 0.07)' // X축 Y축 번진값 컬러*rgba의 a는 alpha값으로 투명도 조절)
            }}>
                <Box>
                    {/* 제목 */}
                    <Typography variant='h5' sx={{ fontWeight: 600, fontSize: 24, mb: 3, mt: 1 }}>
                        게시글 목록
                    </Typography>

                    {/* 검색 */}
                    <PostSearch
                        keyword={keyword}
                        onSubmit={handleSearch}
                        onChangeKeyword={setKeyword}
                    />

                    {/* 테이블 */}
                    <PostTable posts={content} apiBasic={apiBasic} />

                    {/* 페이지네이션 */}
                    <PostPagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        logined = { !meIsLoading && !!me } // 로딩 상태 true, 데이터 true 일 때 -> true
                        />
                </Box>

            </Paper>

        </Box>
    );
}

export default PostList;