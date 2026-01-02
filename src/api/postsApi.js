import { api } from "./api";

// 게시글 목록(조회) PostList.jsx -> posts (덩어리=객체로 보냄) -> ({ 바로 매개변수 구조분해 + 기본값 })
// async를 사용하면 이 함수는 앞으로 비동기 함수로 쓰겠다!! 대기를 했다가 데이터가 불러와지면 처리를 하는 걸로 기능함
export async function fetchPosts({ page = 0, size = 10, keyword = '' }) { // 값이 안 들어올 경우를 대비해 매개변수 안에서 기본값을 줌
    // 스프링에 postController에 조회+검색+페이징 의 get메서드를 가지고 있는 필드(?)에서 사용하고 있는 변수들
    const params = { page, size };
    if (keyword && keyword.trim() !== '') { // GET으로 넘겨줄 때 항상 keyword를 불러오는 것이 아니라서 조건문으로 불러와주기
        params.keyword = keyword; // param이라고 하는 곳에 keyword를 넣겠다
    }
    // axios.get(url, { params }); GET 요청을 보낼 때 Axios가 자동으로 쿼리 스트링을 붙여줌
    const res = await api.get(`/api/posts`, { params }); // 여기서 api는 api.js에서 axios를 넣어서 선언한 api. 그러니까 axios를 사용한 것임

    return res.data;
    // axios를 사용하는 경우 data로 작성을 해야 알아서 인식해서 데이터를 받아줌?
}

// 게시글 상세 내용 PostDetail.jsx
export async function fetchPostDetail(id) {
    const res = await api.get(`/api/posts/${id}`);
    return res.data;
}

// 게시글 생성
export async function createPost(payload) { // payload는 data처럼 '데이터의 묶음'을 의미하는 관용적 표현
    const res = await api.post(`/api/posts`, payload);
    return res.data;
}

// 게시글 수정
export async function updatePost(id, payload) {
    const res = await api.put(`/api/posts/${id}`, payload);
    return res.data;
}

// 게시글 삭제
export async function deletePost(id) {
    await api.delete(`/api/posts/${id}`)
}