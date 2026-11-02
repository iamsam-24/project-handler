package com.lackji.project2.service;

import com.lackji.project2.entity.Membership;
import com.lackji.project2.entity.Organisation;
import com.lackji.project2.entity.User;
import com.lackji.project2.repository.MembershipRepository;
import com.lackji.project2.repository.OrganisationRepository;
import com.lackji.project2.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MembershipService {

    MembershipRepository membershipRepository;
    UserRepository userRepository;
    OrganisationRepository organisationRepository;


    public MembershipService(MembershipRepository membershipRepository, UserRepository userRepository, OrganisationRepository organisationRepository) {
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
    }

    @Transactional
    public void createMembership(UUID userId, UUID orgId){


        User user= userRepository.findById(userId).
                orElseThrow(
                        ()->  new RuntimeException("User not found")
                );


        Organisation organisation=organisationRepository.getOrgById(orgId);

        Membership membership=new Membership();
        membership.setUser(user);
        membership.setOrganisation(organisation);



        membershipRepository.save(membership);
    }

    @Transactional
    public Membership getById(Long id){
        return membershipRepository.getById(id);
    }

    @Transactional
    public void deleteMembership(Long id){
        membershipRepository.delete(id);
    }

}
