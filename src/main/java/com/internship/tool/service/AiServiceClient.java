package com.internship.tool.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * AiServiceClient — AI Developer 3, Day 6
 *
 * RestTemplate-based client for all Flask AI microservice endpoints.
 * - 10-second connect + read timeout on every call.
 * - Graceful null return on any error (never throws to the caller).
 * - Covers all 6 AI endpoints required by the capstone spec.
 */
@Service
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);

    private final RestTemplate restTemplate;

    @Value("${AI_SERVICE_URL:http://localhost:5000}")
    private String aiServiceUrl;

    public AiServiceClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    // ─── Public API methods ───────────────────────────────────────────────────

    /** POST /describe — structured description of a personal data item. */
    public Map<String, Object> describe(String text) {
        return postToAiService("/describe", Map.of("text", text));
    }

    /** POST /categorise — classify item into a privacy category with confidence. */
    public Map<String, Object> categorise(String text) {
        return postToAiService("/categorise", Map.of("text", text));
    }

    /** POST /recommend — 3 actionable data-privacy recommendations. */
    public Map<String, Object> recommend(String text) {
        return postToAiService("/recommend", Map.of("text", text));
    }

    /**
     * POST /generate-report — async report generation.
     * Returns {"job_id": "...", "status": "pending"} immediately.
     * Poll GET /job/{job_id} for completion.
     */
    public Map<String, Object> generateReport(Map<String, Object> data) {
        return postToAiService("/generate-report", data);
    }

    /**
     * POST /query — RAG-powered Q&A using ChromaDB knowledge base.
     *
     * @param question natural-language question about personal data
     * @return {"answer": "...", "sources": [...]}
     */
    public Map<String, Object> query(String question) {
        return postToAiService("/query", Map.of("question", question));
    }

    /**
     * POST /analyse-document — analyse free-form text, returning key insights and risks.
     *
     * @param text raw document text to analyse
     * @return {"findings": [...], "risk_level": "...", ...}
     */
    public Map<String, Object> analyseDocument(String text) {
        return postToAiService("/analyse-document", Map.of("text", text));
    }

    /**
     * POST /batch-process — send up to 20 items for bulk AI processing.
     *
     * @param items list of text items to process
     * @return {"results": [...]}
     */
    public Map<String, Object> batchProcess(List<String> items) {
        return postToAiService("/batch-process", Map.of("items", items));
    }

    // ─── Private helper ───────────────────────────────────────────────────────

    /**
     * Centralised POST helper.
     * Returns null — never throws — if the AI service is unreachable or returns an error.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> postToAiService(String endpoint, Object requestBody) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.postForObject(
                    aiServiceUrl + endpoint, entity, Map.class);

            log.debug("AI service {} responded successfully.", endpoint);
            return response;

        } catch (Exception e) {
            log.error("Error calling AI service at {}: {}", endpoint, e.getMessage());
            return null; // graceful null — caller must handle null safely
        }
    }
}
