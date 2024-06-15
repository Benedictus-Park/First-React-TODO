package com.example.reacttf;

import com.example.reacttf.DTOs.RestoreKey;
import com.example.reacttf.DTOs.Todo;
import com.example.reacttf.DTOs.User;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Random;

@Repository
public class Repositories {
    EntityManager em;

    public UserRepository userRepository;
    public TodoRepository todoRepository;

    public Repositories(){
        userRepository = new UserRepository(em);
        todoRepository = new TodoRepository(em);
    }

}


@Repository
@Transactional
class UserRepository{
    private EntityManager em;

    public UserRepository(EntityManager em){
        this.em = em;
    }

    public void Insert(User user){
        em.persist(user);
    }

    public User FindByEmail(String email){
        try{
            return em.createQuery("SELECT u FROM User AS u WHERE u.email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
        }
        catch(NoResultException e){
            return null;
        }
    }

    public User GetUserByUid(long uid){
        return em.find(User.class, uid);
    }

    public int InsertRestoreKey(long uid){
        Random rand = new Random();
        RestoreKey key = new RestoreKey();
        int ott = rand.nextInt(100000, 1000000);

        rand.setSeed(System.currentTimeMillis());

        while(em.createQuery("SELECT r FROM RestoreKey as r WHERE r.ott=:ott", RestoreKey.class)
                .setParameter("ott", ott)
                .getResultList().size() != 0){
            ott = rand.nextInt(100000, 1000000);
        }

        key.setOtt(ott);
        key.setUid(uid);
        em.persist(key);

        return key.getOtt();
    }

    public void ChangePwd(User u, String hashedPwd){
        u.setHashed_pwd(hashedPwd);
        em.persist(u);
    }

    public void DeleteRestoreKey(long uid){
        em.remove(em.createQuery("SELECT r FROM RestoreKey as r WHERE r.uid = :uid", RestoreKey.class)
                        .setParameter("uid", uid)
                        .getSingleResult());
    }

    public RestoreKey GetRestoreKeyByUid(int ott){
        try {
            return em.createQuery("SELECT r FROM RestoreKey as r WHERE r.ott=:ott", RestoreKey.class)
                    .setParameter("ott", ott)
                    .getSingleResult();
        }
        catch(NoResultException e){
            return null;
        }
    }
}

@Repository
@Transactional
class TodoRepository {
    private EntityManager em;

    public TodoRepository(EntityManager em){
        this.em = em;
    }

    public void Insert(Todo todo){
        User u = em.find(User.class, todo.getUid());
        u.setCnt(u.getCnt() + 1);
        em.persist(u);
        em.persist(todo);
    }

    public void Update(Todo todo){
        em.persist(todo);
    }

    public void DeleteById(int uid, int id){
        em.createQuery("SELECT todo FROM Todo AS todo WHERE uid=:uid AND id=:id", Todo.class)
                .setParameter("uid", uid)
                .setParameter("id", id)
                .getResultList();

        em.remove(em.find(Todo.class, id));
    }

    public Todo GetTodoById(int id){
        return em.find(Todo.class, id);
    }

    public List<Todo> GetAllTodosByUid(int uid){
        return em.createQuery("SELECT todo FROM Todo AS todo WHERE uid=:uid", Todo.class)
                .setParameter("uid", uid)
                .getResultList();
    }
}
