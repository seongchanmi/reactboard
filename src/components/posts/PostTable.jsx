import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router";
import dayjs from 'dayjs';

function PostTable({ posts, apiBasic }) { // 매개변수에 {posts}로 안하면 props.posts로 구조분해를 해야함

    const lists = posts ? posts : []; // 없으면 빈배열 

    return (
        <TableContainer sx={{ mt: 3 }}>
            <Table>
                {/* 테이블 머릿말 */}
                <TableHead>
                    <TableRow sx={{
                        '& th': { // row 안에 있는 모든 <th> 셀에 스타일 적용
                            borderBottom: '1px solid #d8d5d8ff',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#937'
                        }
                    }}>
                        <TableCell align="center" width={80}>번호</TableCell>
                        <TableCell align="center" width={90}>미리보기</TableCell>
                        <TableCell>제목</TableCell>
                        <TableCell align="center" width={160}>작성자</TableCell>
                        <TableCell align="center" width={80}>조회수</TableCell>
                        <TableCell align="center" width={180}>작성일</TableCell>
                    </TableRow>
                </TableHead>

                {/* 테이블 본문 */}
                <TableBody>
                    {
                        lists.map(({ id, imageUrl, title, readCount, createdAt, author }) => (

                            <TableRow key={id}
                                hover sx={{ '& td': { fontSize: 15, borderBottom: '1px solid #e0e0e0' } }}
                            >
                                <TableCell align="center">{id}</TableCell>
                                <TableCell align="center"> {imageUrl ? (
                                    <img
                                        src={`${apiBasic}${imageUrl}`}
                                        alt={title}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            objectFit: 'cover',
                                            borderRadius: 8
                                        }}
                                    />
                                ) : (
                                    <Typography sx={{ fontSize: 12, color: '#aaa' }}>
                                        no image
                                    </Typography>
                                )}</TableCell>
                                <TableCell>
                                    <Typography component={Link} to={`/posts/${id}`}
                                        sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
                                    >
                                        {title}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        author?.nickname && author.nickname !== '익명' ? (
                                            <Chip label={author.nickname} size='small' variant='outlined' sx={{ borderRadius: 999, ps: 2, height: 25, fontSize: 13, bgcolor: 'primary.main', color: '#fff' }} />
                                        ) : (
                                            <Typography sx={{ fontSize: 14 }}>{author.nickname ||'익명'}</Typography>
                                        )
                                    }
                                </TableCell>
                                <TableCell align="center">{readCount}</TableCell>
                                <TableCell align="center" sx={{ color: '#929299ff' }}>
                                    {/* { new Date(createdAt).toLocaleString() } */}
                                    {dayjs(createdAt).format('YY년 MM월 DD일 HH:mm')}
                                </TableCell>
                            </TableRow>
                        ))
                    }

                    {/* 게시글이 하나도 없을 때 */}
                    {
                        lists.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align='center' sx={{ py: 5 }}>
                                    게시글이 없습니다.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;