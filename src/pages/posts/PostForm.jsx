import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import PostFormFields from '../../components/posts/PostFormFields';
import PostFormImage from '../../components/posts/PostFormImage';
import PostFormSubmit from '../../components/posts/PostFormSubmit';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, fetchPostDetail, updatePost } from '../../api/postsApi';
import { useNavigate, useParams } from 'react-router';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { uploadImage } from '../../api/fileApi';

// props mode가 create -> 새 글 작성, edit -> 글 수정
function PostForm({ mode }) {
    const isEdit = mode === 'edit'; // true 수정, false 작성
    const queryClient = useQueryClient(); // React Query 캐시 무효화 할 때 사용
    const navigate = useNavigate(); // 페이지 이동
    const { id } = useParams(); // Url에서 :id 같은 동적 파라미터 값을 가져옴. 이 아이는 문자열임..
    const postId = Number(id); // 문자열을 숫자로 변환. "http://localhost:5173/posts/41/edit"에서 '41'이 postId가 되는 것임

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageName, setImageName] = useState("");

    // Api 관련 TanStack Query======================
    // 생성 Mutation
    const createMutation = useMutation({
        //키: 값, 키: 값, ...
        mutationFn: createPost, // 값은 postApi.js에서 만들어둔 함수를 사용. 덩어리째로 받아야 함. api는 서버와 통신하는 함수
        // 서버에서 데이터 저장 -> 성공(자동으로 id 생성)
        onSuccess: (payload) => { // 서버에 저장된 데이터의 id를 불러와 적용
            // 캐시 무효화 후 데이터 다시 불러옴
            queryClient.invalidateQueries({ queryKey: ['posts'] }); // 'posts'라는 이름을 가지고 있는 애들을 업데이트를 해주겠다(캐시를 버리겠다)
            // 이동
            navigate(`/posts/${payload.id}`);
        },
        onError: () => {
            alert('게시글 등록에 실패했습니다.');
        }
    });

    // 수정 모드일 때 기존 데이터 가져오기
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostDetail(postId),
        enabled: isEdit // isEdit가 true(=수정)일 때만 이 함수를 조회를 해주기
    });

    // 수정 Mutaiton
    const updateMutation = useMutation({
        mutationFn: (payload) => updatePost(postId, payload),
        onSuccess: (update) => { // 여기서 update는 postApi.js에서 return값으로 돌려받는 res.data
            // 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            // 상세 내용 무효화
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            // 이동
            navigate(`/posts/${update.id}`);
        },
        onError: () => {
            alert('게시글 수정에 실패했습니다.')
        }
    });

    // side effect: 렌더링 후 하는 부가 작업
    // useEffect(콜백함수(() => {}), 변경값([])); 기본구조
    useEffect(() => {
        if (isEdit && post) { // 수정 && 데이터
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.imageUrl || ""); // 이미지 추가

            if (post.imageUrl) {
                const fileName = post.imageUrl.split('/').pop();
                setImageName(fileName);
            }
        }
    }, [isEdit, post]) // [isEdit, post]의 상태가 변경되면 업데이트

    // 이미지 업로드 Mutation
    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            setImageUrl(result.imageUrl)
        },
        onError: () => {
            alert('이미지 업로드 실패');
        }
    })

    if (isEdit && isLoading) return <Loader />
    if (isEdit && isError) return <ErrorMessage error={error} />

    // 이벤트 핸들러 ===============================
    // 이미지 업로드
    const onChangeImage = async (evt) => {
        const file = evt.target.files?.[0];
        if (!file) return;

        setImageName(file.name);

        if (file.size > 5 * 1024 * 1024) {
            alert('이미지는 5MB 이하만 가능합니다.')
            return;
        }

        uploadMutation.mutate(file);

        /*
        try {
            setUploading(true);
            const result = await uploadImage(file);

            setImageUrl(result.imageUrl);
        } catch {
            alert('이미지 업로드에 실패했습니다.');
        } finally { // finally는 무조건 실행함
            setUploading(false);
        }
        */

    }


    // 폼 전송 **
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const payload = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imageUrl || null
        }

        // 검증
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용은 필수입니다.');
            return;
        }

        // 이미지 업로드 중이면 저장 막기
        if (uploadMutation.isPending) {
            alert('이미지 업로드 중입니다.');
            return;
        }

        // 받은 props에 따라 생성/수정 mutation 호출
        if (isEdit) {
            updateMutation.mutate(payload); // 수정
        } else {
            createMutation.mutate(payload); // 작성
        }
    }


    return (
        <Box>
            <Paper sx={{
                width: '100%',
                borderRadius: 3,
                px: 4,
                py: 3,
                boxShadow: '0 16px 40px rgba(0,0,0,0.07)'
            }}>
                {/* 제목: 새 글 작성 / 글 수정 */}
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
                    {isEdit ? '게시글 수정' : '새 글 작성'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        {/* 입력 필드 */}
                        <PostFormFields
                            title={title}
                            content={content}
                            onChangeTitle={setTitle}
                            onChangeContent={setContent}
                        />

                        {/* 이미지 업로드 */}
                        <PostFormImage
                            onChangeImage={onChangeImage}
                            uploading={uploading}
                            imageName={imageName} />

                        {/* 등록 / 수정 버튼 */}
                        <PostFormSubmit isEdit={isEdit} />

                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default PostForm;