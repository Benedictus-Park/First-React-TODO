package com.example.reacttf;

import com.example.reacttf.DTOs.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Slf4j
@Service
public class TokenProvider {
    private static final String SECRET_KEY = "TVpvE&~~]b9HeV}G";

    public String Create(User user){
        Date exp = Date.from(
                Instant.now().plus(1, ChronoUnit.DAYS)
        );

        return Jwts.builder()
                .setSubject(Long.toString(user.getUid()))
                .setIssuedAt(new Date())
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public int ValidateToken(String token){
        return Integer.parseInt(Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody().getSubject());
    }
}
