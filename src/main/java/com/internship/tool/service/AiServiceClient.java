package com.internship.tool.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Service
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${AI_SERVICE_URL:http://localhost:5000}")
    private String aiServiceUrl;

    public AiServiceClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public Map<String, Object> describe(String text) {
        return postToAiService("/describe", Map.of("text", text));
    }

    public Map<String, Object> categorise(String text) {
        return postToAiService("/categorise", Map.of("text", text));
    }

    public Map<String, Object> recommend(String text) {
        return postToAiService("/recommend", Map.of("text", text));
    }

    public Map<String, Object> generateReport(Map<String, Object> data) {
        return postToAiService("/generate-report", data);
    }

    private Map<String, Object> postToAiService(String endpoint, Object requestBody) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);
            
            return restTemplate.postForObject(aiServiceUrl + endpoint, entity, Map.class);
        } catch (Exception e) {
            // Day 6 Requirement: Graceful null return on error
            System.err.println("Error calling AI service at " + endpoint + ": " + e.getMessage());
            return null;
        }
    }
}
