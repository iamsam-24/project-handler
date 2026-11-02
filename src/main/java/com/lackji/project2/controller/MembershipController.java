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

    @GetMapping("/{id}")

    public ResponseEntity<Membership> getMember(@PathVariable Long id){
        Membership membership= membershipService.getById(id);

        return ResponseEntity.ok(membership);

    }

    @DeleteMapping("/{id}")

    public ResponseEntity<String> deleteMember(@PathVariable Long id){
        membershipService.deleteMembership(id);
        return ResponseEntity.ok("Membership deleted related user and org");
    }

}
