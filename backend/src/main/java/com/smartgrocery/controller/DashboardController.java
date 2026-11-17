package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.DashboardResponse;
import com.smartgrocery.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboard;
    public DashboardController(DashboardService dashboard) { this.dashboard = dashboard; }
    @GetMapping public DashboardResponse get(@AuthenticationPrincipal Long userId) { return dashboard.get(userId); }
}
