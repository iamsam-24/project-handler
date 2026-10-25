package com.lackji.project2.controller;

import com.lackji.project2.entity.Organisation;
import com.lackji.project2.entity.Project;
import com.lackji.project2.service.OrganisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @GetMapping("/{id}")
    public ResponseEntity<Organisation> getOrgById(@PathVariable UUID id){
        Organisation organisation=organisationService.getOrgById(id);
        return ResponseEntity.ok(organisation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrg(@PathVariable UUID id){
        organisationService.deleteOrg(id);
        return ResponseEntity.ok("Organisation Deleted");
    }
}
