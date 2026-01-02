import { useQuery } from "@tanstack/react-query";
import { fetchMe, getToken, ME_QUERY_KEY } from "../api/authApi";

// 로그인한 사용자 정보를 가져오는 커스텀 훅
export function useMe() {
    const token = getToken();

    return useQuery({
        queryKey: ME_QUERY_KEY,
        queryFn: fetchMe,
        enabled: !!token, // 토큰이 있을 때만 실행, 그냥 넣으면 문자열이라 오류가 날 수 있지만, !!를 붙이면 true 값으로 나오게(!를 붙이면 false가 나옴)
        retry: false, // 재시도 안 할 거임. 권한과 관련된 실행은 재시도 안함. 잘못 하다가는 뚫릴 수 있음..ㅎ
        staleTime: 1000 * 60
    });
}