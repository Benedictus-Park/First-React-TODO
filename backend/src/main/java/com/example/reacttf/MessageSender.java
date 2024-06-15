package com.example.reacttf;

import com.fasterxml.jackson.annotation.JsonValue;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

@Controller
public class MessageSender {
    @RequestMapping(produces="application/json;charset=UTF-8", method= RequestMethod.POST)
    @ResponseBody
    public static boolean SendMessage(String title, String context, String to){
        JSONObject req = new JSONObject();
        JSONObject message = new JSONObject();
        String timemills = Long.toString(System.currentTimeMillis());
        ArrayList<JSONObject> lst = new ArrayList<>();

        try{
            message.put("to", to);

            lst.add(message);

            req.put("type", "LMS");
            req.put("from", "01032619432");
            req.put("subject", title);
            req.put("content", context);
            req.put("messages", lst);

            URL url = new URL("https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:331909611340:cuk-oop-proj/messages");
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json;utf-8");
            conn.setRequestProperty("x-ncp-apigw-timestamp", timemills);
            conn.setRequestProperty("x-ncp-iam-access-key", "qh016FTsm0jwjzkTGuoO");
            conn.setRequestProperty("x-ncp-apigw-signature-v2", makeSignature(timemills));

            conn.setDoOutput(true);

            OutputStreamWriter os = new OutputStreamWriter(conn.getOutputStream());
            os.write(req.toString());
            os.flush();

            System.out.println(conn.getResponseCode());
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private static String makeSignature(String timemills){
        String space = " ";
        String newLine = "\n";
        String method = "POST";
        String url = "/sms/v2/services/ncp:sms:kr:331909611340:cuk-oop-proj/messages";
        String timestamp = timemills;
        String accessKey = "qh016FTsm0jwjzkTGuoO";
        String secretKey = "7ZPTP2ih2QY0RUGWIsvuAVwbkAFqKx50hF2S3PZD";
        byte[] rawHmac;

        String message = new StringBuilder()
                .append(method)
                .append(space)
                .append(url)
                .append(newLine)
                .append(timestamp)
                .append(newLine)
                .append(accessKey)
                .toString();

        try{
            SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);

            rawHmac = mac.doFinal(message.getBytes("UTF-8"));
        }
        catch(Exception e){
            return null;
        }

        return Base64.encodeBase64String(rawHmac);
    }
}
