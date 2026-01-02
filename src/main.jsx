import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

// queryClient 인스턴트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패시 재시도 횟수
      staleTime: 1000 * 60 * 5 // 데이터 유지 시간
    }
  }
});

// mui 스타일 설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#9370db"
    },
    secondary: {
      main: "#dda0dd"
    }
  },
  typography: {
    fontFamily: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui, Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif"].join(',')
  }
});

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      {/* <App />을 <QueryClientProvider client={ }>로 감싸면 하위 파일에 전부 적용됨  */}
      <CssBaseline />
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>
)
