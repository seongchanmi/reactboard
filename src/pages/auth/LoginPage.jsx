import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login, setAuth } from "../../api/authApi";

function LoginPage() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            setAuth(data); // 토큰 저장
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            navigate("/posts"); // 사용자 정보 갱신 후 이동
        }
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();

        // 이전 오류 초기화
        loginMutation.reset();

        const fd = new FormData(evt.currentTarget);
        loginMutation.mutate({
            email: String(fd.get("email")).trim(),
            password: String(fd.get("password")).trim()
        });
    }


    return (
        <Container maxWidth='sm'>
        <Paper sx={{
                width: '100%',
                borderRadius: 3,
                px: 4,
                py: 3,
                boxShadow: '0 16px 40px rgba(0,0,0,0.07)'
            }}>
            <Typography variant='h5' fontWeight='500' gutterBottom>로그인</Typography>
            <Typography variant='body2' color='text.secondary' mb={3}>이메일과 비밀번호를 입력하세요</Typography>

            <Box component="form" sx={{ mt: 5, mb: 2 }} onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField label='이메일' name='email' type='email' placeholder='test@test.com' size='small' required />
                    <TextField label='비밀번호' name='password' type='password' placeholder='비밀번호' size='small' required />

                    {
                         loginMutation.isError && (
                                <Typography variant='body2' color='error'>로그인에 실패했습니다.</Typography>
                            )
                    }

                    <Button type='submit' variant='contained' sx={{ mt: 1, py: 1.2, borderRadius: 2, textTransform: 'none', "&:hover": { backgroundColor: '#999' } }} disabled={loginMutation.isPending}>{loginMutation.isPending ? "로그인 중..." : "로그인"}</Button>
                </Stack>
            </Box>
        </Paper>
        </Container>
    );
}

export default LoginPage;