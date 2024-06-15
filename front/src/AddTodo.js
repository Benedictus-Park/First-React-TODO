import React from "react";
import {TextField, Paper, Button, Grid} from "@mui/material";

export default class AddTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {item:{title:""}};
        this.add = props.add;
    }

    onInputChange = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({item:thisItem});
    }

    onButtonClick = () => {
        this.add(this.state.item);
        this.setState({item:{title:""}});
    }

    enterKeyEventHandler = (e) => {
        if(e.key == 'Enter'){
            this.onButtonClick();
        }
    }

    render(){
        return (
            <Paper style={{margin:16, padding:16}}>
                <Grid container>
                    <Grid xs={11} md={14} item>
                        <TextField
                            placeholder="Add Todo here"
                            fullWidth
                            onChange={this.onInputChange}
                            value={this.state.item.title}
                            onKeyPress={this.enterKeyEventHandler}
                            mb={3}
                            style={{marginBottom:"5px"}}
                        />
                        <Button
                            fullWidth
                            color="secondary"
                            variant="outlined"
                            onClick={this.onButtonClick}
                        >
                            +
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}