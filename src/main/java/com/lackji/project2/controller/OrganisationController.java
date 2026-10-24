package com.lackji.project2.controller;

import com.lackji.project2.entity.Organisation;
import com.lackji.project2.service.OrganisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/organisation")
public class OrganisationController {

    OrganisationService organisationService;

    public OrganisationController(OrganisationService organisationService) {

        this.organisationService = organisationService;
    }

    @PostMapping
    public ResponseEntity<String> createOrg(@RequestBody Organisation organisation){
        organisationService.createOrg(organisation);

        return ResponseEntity.ok("Done");

    }
}
