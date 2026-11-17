package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.AnalyticsResponse;
import com.smartgrocery.service.AnalyticsService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analytics;
    public AnalyticsController(AnalyticsService analytics) { this.analytics = analytics; }
    @GetMapping public AnalyticsResponse get(@AuthenticationPrincipal Long userId) { return analytics.get(userId); }
}
