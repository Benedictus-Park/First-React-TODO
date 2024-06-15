import React from 'react';
import {ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from '@mui/material';
import {DeleteOutlined} from "@mui/icons-material";

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { item: props.item };
        this.delete = props.delete;
    }

    deleteEventHandler = () => {
        this.delete(this.state.item);
    }

    offReadOnlyMode = () => {
        console.log("Event!", this.state.readOnly)
        this.setState({readOnly:false}, () => {
            console.log("ReadOnly?", this.state.readOnly);
        });
    }

    enterKeyEventHandler = (e) => {
        if(e.key === "Enter"){
            this.setState({readOnly:true});
        }
    }

    editEventHandler = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({item:thisItem});

        fetch("http://115.21.157.157:8080/todo/update", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                "id":thisItem.id,
                "title":thisItem.title,
                "checked":thisItem.checked,
                "date":thisItem.date
            })
        });
    }

    checkboxEventHandler = (e) => {
        const thisItem = this.state.item;
        thisItem.checked = thisItem.checked ? false : true;
        this.setState({item:thisItem});

        fetch("http://115.21.157.157:8080/todo/update", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                "id":thisItem.id,
                "title":thisItem.title,
                "checked":thisItem.checked,
                "date":thisItem.date
            })
        });
    }

    render(){
        const item = this.state.item;

        return (
            <ListItem style={{paddingBottom:"1px", paddingTop:"1px", height:"25px"}}>
                <Checkbox
                    checked={item.checked}
                    onChange={this.checkboxEventHandler}
                    style={{
                        transform:"scale(0.8)",
                    }}
                />
                <ListItemText>
                    <InputBase
                        inputProps={{"aria-label":"naked"}}
                        type="text"
                        id={'todo_' + this.state.item.id.toString()}
                        name={'todo_' + this.state.item.id.toString()}
                        value={item.title}
                        multiline={true}
                        fullWidth={true}
                        onClick={this.offReadOnlyMode}
                        onChange={this.editEventHandler}
                        onKeyPress={this.enterKeyEventHandler}
                        style={{
                            fontSize:13
                        }}
                    />
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={this.deleteEventHandler}>
                        <DeleteOutlined
                            style={{
                                transform:"scale(0.8)",
                            }}
                        />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default Todo;