import React from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment, updateComment, deleteComment } from "../../api/commentApi";
import { useState } from "react";
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { useMe } from "../../hooks/useMe";

function PostComments({ postId }) {

    const queryClient = useQueryClient();

    // 새 댓글 입력
    const [newContent, setNewContent] = useState("");

    // 수정 모드
    const [edit, setEdit] = useState(false);

    // 수정 댓글 입력
    const [editContent, setEditContent] = useState("");

    const { data: me, isLoading: meIsLoading } = useMe();
    const isMe = !meIsLoading && !!me;

    // 로그인한 사용자와 작성자가 동일한지 확인하는 함수
    const loginedEdit = (authorId) => (
        !meIsLoading &&
        me?.id != null &&
        authorId != null &&
        Number(authorId) === Number(me.id)
    )

    // TanStack Query ========================
    // 조회
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        // 컴포넌트 안에 또 컴포넌트... 이런식으로 가기 때문에 같은 이름이면 충돌이 일어날 수 있으니까 이름을 바꿔줌
        error } = useQuery({
            queryKey: ['postComments', postId],
            queryFn: () => fetchComments(postId)
        });

    //작성
    const createCommentMutation = useMutation({
        mutationFn: (content) => createComment(postId, { content }),
        // content는 아래에서 (return의 영역에서 입력 받은 값)을 매개변수로 넘겨주는 것임
        onSuccess: () => {
            setNewContent(""); // 작성이 성공하면 필드값을 지워(초기화)
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 등록에 실패했습니다.')
        }
    }); // .mutate(newContent);

    //수정
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, { content }),
        onSuccess: () => {
            setEdit(null);
            setEditContent("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert("댓글 수정에 실패했습니다.");
        }
    });

    //삭제
    const deletecommentMutaion = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert("댓글 삭제에 실패했습니다.");
        }
    });

    // 이벤트 핸들러 =========================
    // 댓글 작성
    const handleNewComment = (evt) => {
        evt.preventDefault();

        if (!isMe) return; // 로그아웃 상태면 종료

        const newComment = newContent.trim();
        if (!newComment) return;
        createCommentMutation.mutate(newComment);
    }

    // 수정 시작
    const handleStartEdit = (comment) => {

        // 본인 확인 
        if (!loginedEdit(comment.author?.id)) return;

        setEdit(comment.id);// 수정모드로 변경되기 위해 아이디가 필요함
        setEditContent(comment.content);// 기존 내용을 보여줌
    }

    // 수정 저장
    const handleSaveEdit = (commentId) => {
        const editComment = editContent.trim();
        if (!editComment) return;
        updateCommentMutation.mutate({ commentId, content: editComment });
    }

    // 수정 취소
    const handleCancelEdit = () => {
        setEdit(null);
        setEditContent("");
    }

    // 삭제
    const handleDeleteComment = (commentId) => {
        const comment = comments.find((element) => element.id === commentId);
        if (!comment) return;

        // 본인 확인
        if (!loginedEdit(comment.author?.id)) return;

        if (!window.confirm("댓글을 삭제하겠습니까?")) return;

        deletecommentMutaion.mutate(commentId);
    }

    return (
        <Box>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, fontSize: 16 }}>댓글</Typography>

            {isCommentsLoading && <Loader />}
            {isCommentsError && <ErrorMessage />}

            {/* 댓글 목록 */}
            {!isCommentsLoading && !isCommentsError &&
                comments.map((comment) => {
                    const { id, content, createdAt, author } = comment;

                    const isLogin = loginedEdit(author?.id);

                    return (
                        <Paper key={id} variant='outlined' sx={{ p: 2, mb: 1.5 }}>
                            {
                                edit === id ? (
                                    <>
                                        {/* 수정 모드 */}
                                        <TextField fullWidth value={editContent} onChange={(evt) => setEditContent(evt.target.value)} />

                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Button size='small' variant='contained' onClick={() => handleSaveEdit(id)}>저장</Button>
                                            <Button size='small' variant='outlined' color='inherit' onClick={handleCancelEdit}>취소</Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <>
                                        {/* 리스트 모드 */}
                                        <Typography>
                                            {content}
                                        </Typography>

                                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                            <Typography variant='caption'>
                                                {author?.nickname || '익명'} -{" "}
                                                {createdAt && new Date(createdAt).toLocaleString()}
                                            </Typography>

                                            {/* 본인 댓글일 때만 버튼 표시 */}
                                            {
                                                isLogin && (
                                                    <Stack direction="row" spacing={1}>
                                                        <Button size='small' onClick={() => handleStartEdit(comment)}>수정</Button>
                                                        <Button size='small' color='error' onClick={() => handleDeleteComment(id)}>삭제</Button>
                                                    </Stack>
                                                )
                                            }
                                        </Stack>
                                    </>
                                )
                            }
                        </Paper>
                    )
                })
            }

            {/* 댓글 작성 - 로그인 상태에서만 표시 */}
            {
                isMe ? (
                    // 로그인 상태
                    <Box component="form" sx={{ mt: 2 }} onSubmit={handleNewComment}>
                        <TextField fullWidth multiline minRows={2} label="댓글 내용" value={newContent} onChange={(evt) => setNewContent(evt.target.value)} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Button type='submit' variant='contained' size='small' sx={{ borderRadius: 999 }}>댓글 등록</Button>
                        </Box>
                    </Box>
                ) : (
                    // 로그아웃 상태
                    <Alert serverity='info' sx={{ mt: 2 }}>댓글을 작성하시려면 로그인을 해 주세요.</Alert>
                )
            }
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
}

export default PostComments;