package com.example.reacttf;

import java.util.ArrayList;
import java.util.List;
import com.example.reacttf.DTOs.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class Services {
    private final Repositories repositories;
    private final UserService userService;
    private final TodoService todoService;

    public Services(){
        repositories = new Repositories();
        userService = new UserService(repositories.userRepository);
        todoService = new TodoService(repositories.todoRepository);
    }
}

@Service
class UserService{
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public long InsertUser(User user){
        userRepository.Insert(user);
        return user.getUid();
    }

    public User FindByEmail(String email){
        return userRepository.FindByEmail(email);
    }

    public int InsertRestoreKey(long uid){
        return userRepository.InsertRestoreKey(uid);
    }

    public void DeleteRestoreKey(long uid){
        userRepository.DeleteRestoreKey(uid);
    }

    public User GetUserByUid(long uid){
        return userRepository.GetUserByUid(uid);
    }

    public void ChangePwd(User u, String hashed_pwd){
        userRepository.ChangePwd(u, hashed_pwd);
    }

    public RestoreKey GetRestoreKeyByUid(int ott){
        return userRepository.GetRestoreKeyByUid(ott);
    }
}

@Service
class TodoService{
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository){
        this.todoRepository = todoRepository;
    }

    public void InsertTodo(Todo todo){
        todoRepository.Insert(todo);
    }

    public void UpdateTodo(Todo todo){
        todoRepository.Update(todo);
    }

    public Todo GetTodoById(int id){
        return todoRepository.GetTodoById(id);
    }

    public void DeleteById(int uid, int id){
        todoRepository.DeleteById(uid, id);
    }

    public List<Todo> GetAllTodos(int uid){
        return todoRepository.GetAllTodosByUid(uid);
    }
}