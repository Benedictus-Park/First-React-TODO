package com.example.reacttf;

import com.example.reacttf.DTOs.Todo;
import com.example.reacttf.DTOs.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
class TodoController{
    private final TodoService todoService;
    private final UserService userService;

    @RequestMapping("/todo/insert")
    public ResponseEntity<?> InsertTodo(@RequestBody TodoDTO_req dto, @RequestHeader("Authorization") String token){
        Todo todo = new Todo();
        TokenProvider tokenProvider = new TokenProvider();
        int uid = tokenProvider.ValidateToken(token);

        todo.setUid(uid);
        todo.setTitle(dto.getTitle());
        try{
            todo.setDate(dto.getDate());
        }
        catch(Exception e){
            return ResponseEntity.internalServerError().body("In InsertTodo()");
        }

        todo.setChecked(dto.isChecked());

        todoService.InsertTodo(todo);
        return ResponseEntity.ok("Success");
    }

    @RequestMapping("/todo/update")
    public ResponseEntity<?> UpdateTodo(@RequestBody TodoDTO_req_u dto, @RequestHeader("Authorization") String token){
        TokenProvider tokenProvider = new TokenProvider();
        int uid = tokenProvider.ValidateToken(token);
        Todo todo = todoService.GetTodoById(dto.getId());

        todo.setUid(uid);
        todo.setTitle(dto.getTitle());

        todo.setChecked(dto.isChecked());

        todoService.UpdateTodo(todo);

        return ResponseEntity.ok("Success");
    }

    @RequestMapping("/todo/delete")
    public ResponseEntity<?> UpdateTodo(@RequestBody DeleteDTO dto, @RequestHeader("Authorization") String token){
        TokenProvider tokenProvider = new TokenProvider();
        int uid = tokenProvider.ValidateToken(token);

        System.out.println(dto.getId());
        todoService.DeleteById(uid, dto.getId());

        return ResponseEntity.ok("Success");
    }

    @RequestMapping("/todo/get-all")
    public ResponseEntity<?> GetAllTodos(@RequestHeader("Authorization") String token){
        TokenProvider tokenProvider = new TokenProvider();
        int uid = tokenProvider.ValidateToken(token);
        TodoDTO_rsp dto = new TodoDTO_rsp();

        dto.setTodos(todoService.GetAllTodos(uid));

        return ResponseEntity.ok().body(dto);
    }

    @RequestMapping("/todo/sendmsg")
    public ResponseEntity<?> SendTodoMessage(@RequestBody MessagingDTO dto, @RequestHeader("Authorization") String token){
        String date = dto.getDate();
        List<String> titles = dto.getTitles();
        TokenProvider tokenProvider = new TokenProvider();
        int uid = tokenProvider.ValidateToken(token);
        String title = date + "일 TODO List";
        String message = "";

        User u = userService.GetUserByUid(uid);

        message += u.getUsername() + "님!\n"
                + date + "일 할 일은 아래와 같습니다.\n\n";

        for(int i = 0; i < titles.size(); i++){
            message += "- " + titles.get(i);
            if(titles.size() != i - 1){
                message += '\n';
            }
        }

        MessageSender.SendMessage(title, message, u.getPhone());

        return ResponseEntity.ok("Success!");
    }

    @Data
    static class MessagingDTO{
        private String date;
        private List<String> titles;
    }

    @Data
    static class TodoDTO_rsp{
        private List<Todo> todos;
    }

    @Data
    static class TodoDTO_req{
        private String title;
        private boolean checked;
        private String date;
    }

    @Data
    static class TodoDTO_req_u{
        private int id;
        private String title;
        private boolean checked;
        private String date;
    }

    @Data
    static class DeleteDTO{
        private int id;
    }
}