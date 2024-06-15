import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                MUI
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function ChangePassword() {
    const navigate = useNavigate();
    const goToSignIn = () => {
        navigate("/");
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        let authcode = document.getElementById("authcode").value;
        let pwd = document.getElementById("new_password").value;
        let pwd_check = document.getElementById("new_password_chk").value;

        if(pwd != pwd_check){
            alert("패스워드를 다시 확인해 주세요.");
        }
        else{
            fetch("http://115.21.157.157:8080/user/perform-restore", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    "ott":authcode,
                    "newPwd":pwd
                })
            }).then((rsp) => {
                if(rsp.ok){
                    alert("패스워드가 변경되었습니다!");
                    goToSignIn();
                }
                else{
                    alert("인증번호가 잘못되었습니다.");
                }
            });
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" style={{
                transform:"scale(1.2)"
            }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="authcode"
                                    label="Authentication code"
                                    type="text"
                                    id="authcode"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="new_password"
                                    label="New Password"
                                    type="password"
                                    id="new_password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="new_password_chk"
                                    label="Retype New Password"
                                    type="password"
                                    id="new_password_chk"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            id="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Change !
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}