import { api } from './api'

// 댓글 목록 조회
export async function fetchComments(postId) {
    const res = await api.get(`/api/posts/${postId}/comments`);
    return res.data;
}

// 댓글 작성
export async function createComment(postId, payload) {
    const res = await api.post(`/api/posts/${postId}/comments`, payload); 
    // payload는 스프링에서 @RequestBody 로 request 데이터를 보냈기 때문에, 그에 상응하는 payload로 데이터를 받아옴
    return res.data;
}

// 댓글 수정
export async function updateComment(postId, commentId, payload) {
    const res = await api.put(`/api/posts/${postId}/comments/${commentId}`, payload);
    return res.data;
}

// 댓글 삭제
export async function deleteComment(postId, commentId) {
    await api.delete(`/api/posts/${postId}/comments/${commentId}`);
}