package com.lackji.project2.controller;


import com.lackji.project2.dto.MembershipRequest;
import com.lackji.project2.entity.Membership;
import com.lackji.project2.service.MembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }


    @PostMapping

    public ResponseEntity<String> createMember(@RequestBody MembershipRequest request){
        membershipService.createMembership(request.getUserId(),request.getOrgId());
        return ResponseEntity.ok("Member created");
    }
}
