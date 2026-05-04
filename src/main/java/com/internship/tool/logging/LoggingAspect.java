package com.internship.tool.logging;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.internship.tool.controller.*.*(..))")
    public Object logController(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        logger.info("➡️ Request: {}()", joinPoint.getSignature().getName());

        Object result = joinPoint.proceed();

        long timeTaken = System.currentTimeMillis() - start;

        logger.info("⬅️ Response: {}() | Time: {} ms",
                joinPoint.getSignature().getName(),
                timeTaken);

        return result;
    }
}