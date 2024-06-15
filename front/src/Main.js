import Todo from './Todo.js';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar, LocalizationProvider, PickersDay} from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Paper, List, Badge} from '@mui/material';
import AddTodo from './AddTodo.js';

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

function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '❗' : undefined}
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

const defaultTheme = createTheme();

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();

        this.state = {
            todoIdx:0,
            items:[],
            all_items:[],
            daysToHighlight:[],
            selectedDate:date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2)
        };

        fetch("http://115.21.157.157:8080/todo/get-all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("jwt")
            },
        }).then((rsp) => {
            if(rsp.ok){
                rsp.json().then((json) => {
                    let l = json['todos'];
                    this.state['todoIdx'] = sessionStorage.getItem("cnt");
                    this.state['all_items'] = l;
                    let thisItems = [];
                    let daysToHighlight = new Set();

                    for(let i = 0; i < this.state['all_items'].length; i++){
                        if(this.state['all_items'][i].date == this.state['selectedDate']){
                            thisItems.push(this.state['all_items'][i]);
                        }
                        daysToHighlight.add(Number(this.state['all_items'][i].date.split("/")[2]));
                    }
                    this.state.daysToHighlight = Array.from(daysToHighlight);

                    let state = this.state;
                    state.items = thisItems;

                    this.setState(state);
                });
            }
            else{
                alert("통신 실패. 서버 오류.");
            }
        });
    }

    onChangeHandler = (val, t1, t2) => {
        this.state['selectedDate'] = val.format("YYYY/MM/DD");
        let thisItems = [];

        for(let i = 0; i < this.state['all_items'].length; i++){
            if(this.state['all_items'][i].date == this.state['selectedDate']){
                thisItems.push(this.state['all_items'][i]);
            }
        }

        let state = this.state;
        state.items = thisItems;
        this.setState(state);
    }

    sendMessage = (event) => {
        event.preventDefault();
        const selectedTodos = this.state.items;
        let titles = [];

        for(let i = 0; i < selectedTodos.length; i++){
            titles.push(selectedTodos[i].title);
        }

        fetch("http://115.21.157.157:8080/todo/sendmsg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                date:this.state.selectedDate,
                "titles":titles
            })
        }).then((rsp) => {
            if(rsp.ok){
                alert("성공!");
            }
            else{
                alert("서버 오류같은디...?");
                return;
            }
        });
    }

    add = (item) => {
        if(!item.title){
            return;
        }

        const thisItems = this.state.items;

        sessionStorage.setItem("cnt", sessionStorage.getItem("cnt") + 1);
        this.state['todoIdx']++;

        item.id = this.state['todoIdx'];
        item.checked = false;
        item.date = this.state.selectedDate;
        thisItems.push(item);
        this.state.all_items.push(item);
        this.setState({items:thisItems});

        fetch("http://115.21.157.157:8080/todo/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                "title":item.title,
                "checked":item.checked,
                "date":this.state['selectedDate']
            })
        });

        let daysToHighlight = new Set();

        for(let i = 0; i < this.state['all_items'].length; i++){
            daysToHighlight.add(Number(this.state['all_items'][i].date.split("/")[2]));
        }

        this.setState({daysToHighlight:Array.from(daysToHighlight)});
    }

    pass = () => {
        return false;
    }

    delete = (item) => {
        const thisItems = this.state.items;
        const newItems = thisItems.filter(e => e.id !== item.id);
        this.state.all_items = this.state.all_items.filter(e => e.id !== item.id);
        this.setState({items:newItems});

        fetch("http://115.21.157.157:8080/todo/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                "id":item.id
            })
        });

        let daysToHighlight = new Set();

        for(let i = 0; i < this.state['all_items'].length; i++){
            daysToHighlight.add(Number(this.state['all_items'][i].date.split("/")[2]));
        }

        this.setState({daysToHighlight:Array.from(daysToHighlight)});
    }

    render(){
        if(sessionStorage.getItem("jwt") == null){
            alert("잘못된 접근입니다.");
            window.history.back();
        }

        let todoItems = this.state.items.length > 0 && (
            <Paper style={{margin:16}}>
                <List>
                    {this.state.items.map((item, idx) => (
                        <Todo item={item} key={item.id} delete={this.delete}/>
                    ))}
                </List>
            </Paper>
        );

        let highlightedDays = this.state.daysToHighlight;

        return(
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs" style={{
                    transform:"scale(1.1)"
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
                            <ChecklistIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            TODO-List
                        </Typography>
                        <Box onSubmit={ this.pass } noValidate sx={{ mt: 1 }}>
                            <LocalizationProvider dateAdapter={ AdapterDayjs }>
                                <DateCalendar
                                    onChange={ this.onChangeHandler }
                                    slots={{
                                        day: ServerDay,
                                    }}
                                    slotProps={{
                                        day: {
                                            highlightedDays
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                            <AddTodo add={this.add}/>
                            <div className="TodoList">
                                {todoItems}
                            </div>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={ this.sendMessage }
                        >
                            문자로 오늘의 할 일 받기!
                        </Button>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        );
    }
}

export default MainPage;