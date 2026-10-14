package com.fitcorp.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public RedirectView home() {
        return new RedirectView("/swagger-ui/index.html");
    }

    @GetMapping("/api/v1")
    public ResponseEntity<Map<String, Object>> apiRoot() {
        return ResponseEntity.ok(Map.of(
                "service", "FitCorp REST API",
                "status", "UP",
                "version", "1.0.0",
                "docs", "/swagger-ui/index.html"
        ));
    }
}
