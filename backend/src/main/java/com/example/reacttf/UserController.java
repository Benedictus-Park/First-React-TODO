package com.example.reacttf;

import com.example.reacttf.DTOs.RestoreKey;
import com.example.reacttf.DTOs.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
class UserController{
    private final UserService userService;

    private String hashPW(String pwd){
        PasswordEncoder p = new BCryptPasswordEncoder();
        return p.encode(pwd);
    }

    private boolean checkPW(String rawpwd, String hashed_pwd){
        PasswordEncoder p = new BCryptPasswordEncoder();
        return p.matches(rawpwd, hashed_pwd);
    }

    @RequestMapping("/user/sign-up")
    public ResponseEntity<?> SignUp(@RequestBody SignUpDTO dto){
        User u = null;

        if((u = userService.FindByEmail(dto.getEmail())) != null){
            return ResponseEntity.badRequest().body("Duplicated Email");
        }

        u = new User();
        u.setUsername(dto.getUsername());
        u.setHashed_pwd(hashPW(dto.getPwd()));
        u.setEmail(dto.getEmail());
        u.setPhone(dto.getPhone());

        userService.InsertUser(u);

        return ResponseEntity.ok("SignUp Success!");
    }

    @RequestMapping("/user/sign-in")
    public ResponseEntity<?> SignIn(@RequestBody SignInDTO dto){
        User u = userService.FindByEmail(dto.getEmail());

        if(u == null){
            return ResponseEntity.badRequest().body("SignIn Failed.");
        }
        if(!checkPW(dto.getPwd(), u.getHashed_pwd())){
            return ResponseEntity.badRequest().body("SignIn Failed.");
        }
        else{
            UserDTO udto = new UserDTO();
            TokenProvider provider = new TokenProvider();

            udto.setUsername(u.getUsername());
            udto.setCnt(u.getCnt());
            udto.setToken(provider.Create(u));

            return ResponseEntity.ok().body(udto);
        }
    }

    @RequestMapping("/user/restore")
    public ResponseEntity<?> RestoreRequest(@RequestBody RestoreDTO dto){
        User u = userService.FindByEmail(dto.getEmail());
        int ott;

        if(u == null){
            return ResponseEntity.badRequest().body("Not Exists.");
        }

        ott = userService.InsertRestoreKey(u.getUid());
        MessageSender.SendMessage("[패스워드 재설정 인증번호]", u.getUsername() + "님, 인증번호는 [" + ott + "]입니다.", u.getPhone());

        return ResponseEntity.ok().body("Succeed.");
    }

    @RequestMapping("/user/perform-restore")
    public ResponseEntity<?> RestoreResponse(@RequestBody PerformRestoreDTO dto){
        RestoreKey key = userService.GetRestoreKeyByUid(dto.ott);

        if(key == null){
            return ResponseEntity.badRequest().body("Invalid Req.");
        }
        else{
            long uid = key.getUid();
            userService.DeleteRestoreKey(uid);
            User u = userService.GetUserByUid(uid);
            System.out.println(dto.newPwd);
            userService.ChangePwd(u, hashPW(dto.newPwd));
            return ResponseEntity.ok("Success!");
        }
    }

    @Data
    class UserDTO{
        private String username;
        private int cnt;
        private String token;
    }

    @Data
    static class SignInDTO{
        private String email;
        private String pwd;
    }

    @Data
    static class SignUpDTO{
        private String username;
        private String pwd;
        private String email;
        private String phone;
    }

    @Data
    static class RestoreDTO{
        private String email;
    }

    @Data
    static class PerformRestoreDTO{
        private int ott;
        private String newPwd;
    }
}