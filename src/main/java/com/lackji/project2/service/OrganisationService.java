package com.lackji.project2.service;

import com.lackji.project2.entity.Organisation;
import com.lackji.project2.core.exception.DuplicateFoundException;
import com.lackji.project2.repository.OrganisationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrganisationService {

    OrganisationRepository organisationRepository;

    public OrganisationService(OrganisationRepository organisationRepository) {
        this.organisationRepository = organisationRepository;
    }

    @Transactional
    public void createOrg(Organisation organisation){


        if(nameExists(organisation)){
            throw new DuplicateFoundException(
                    "Organisation named :" +organisation.getName() +"already exists"
            );
        }
        organisationRepository.save(organisation);



    }

    @Transactional

    public Organisation getOrgById(UUID id){
        return organisationRepository.getOrgById(id);
    }

    @Transactional
    public void deleteOrg(UUID id){
        organisationRepository.deleteOrg(id);
    }



    private Boolean nameExists(Organisation organisation){
        return organisationRepository.nameExists(organisation.getName());
    }
}
