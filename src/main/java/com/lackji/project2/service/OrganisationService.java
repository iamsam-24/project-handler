package com.lackji.project2.service;

import com.lackji.project2.entity.Organisation;
import com.lackji.project2.repository.OrganisationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class OrganisationService {

    OrganisationRepository organisationRepository;

    public OrganisationService(OrganisationRepository organisationRepository) {
        this.organisationRepository = organisationRepository;
    }

    @Transactional
    public void createOrg(Organisation organisation){
        organisationRepository.save(organisation);

    }
}
