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

export default function SignUp() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let pwd = document.getElementById("password").value;
        let pwd_chk = document.getElementById("password_chk").value;
        let ph = document.getElementById("ph").value;
        let reqBody;

        if(pwd != pwd_chk){
            alert("패스워드를 다시 확인하세요.");
            return;
        }
        if(!username || !email || !pwd || !ph){
            alert("모든 입력란을 다 채워주세요.");
            return;
        }
        if(ph.search('-') >= 0){
            alert("\'-\'를 제외한 전화번호를 입력해 주세요.");
            return;
        }
        if(ph.length != 11){
            alert("전화번호를 다시 확인하세요.");
            return;
        }

        reqBody = {
            "username":username,
            "pwd":pwd,
            "email":email,
            "phone":ph
        };

        fetch("http://115.21.157.157:8080/user/sign-up", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reqBody)
        }).then((rsp) => {
            if(rsp.ok){
                alert("회원가입이 완료되었습니다!");
                goToSignIn();
                return;
            }
            else{
                alert("이미 회원가입된 이메일입니다.");
            }
        })
    };

    const goToSignIn = () => {
        navigate("/");
    }

    const handlePasswordChk = (event) => {
        let origin = document.getElementById("password");
        let button = document.getElementById("submit");
        let alertText = document.getElementById("pwd-alert");

        if(event.target.value !== origin.value){
            alertText.style.display = 'block';
            button.disabled = true;
        }
        else{
            alertText.style.display = 'none';
            button.disabled = false;
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
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={ handlePasswordChk }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password_chk"
                                    label="Check Password"
                                    type="password"
                                    id="password_chk"
                                    autoComplete="new-password"
                                    onChange={ handlePasswordChk }
                                />
                            </Grid>
                            <Typography sx={{mt: 1, ml: 3, display:'none' }} id="pwd-alert">
                                패스워드를 다시 확인하세요.
                            </Typography>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="ph"
                                    label="Phone Number"
                                    name="ph"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            id="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={goToSignIn} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}