package com.lackji.project2.service;

import com.lackji.project2.dto.UserRequestDto;
import com.lackji.project2.dto.UserResponseDto;
import com.lackji.project2.entity.Role;
import com.lackji.project2.entity.User;
import com.lackji.project2.repository.RoleRepository;
import com.lackji.project2.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private PasswordEncoder passwordEncoder;

    private RoleRepository roleRepository;

    private UserRepository userRepository;

    public AuthService(PasswordEncoder passwordEncoder, RoleRepository roleRepository, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    public UserResponseDto register(UserRequestDto userRequestDto){

     //first get the user

        User user = new User();
        //then get the user name from the userreuest dto

        user.setUsername(userRequestDto.getUsername());
        user.setEmail(userRequestDto.getEmail());

        //use the password encoder
        //get it from the userrquest dto same
        String encodedPass= passwordEncoder.encode(userRequestDto.getPassword());
        //give it to the user
       user.setPassword(encodedPass);
//       user.setEnabled(true);

       //now work same for the roles

        //when i was not able to set the authorities to admin so that new user become admin
        //because it is already set that new user will become admin only then force it in database to do so
        // so these data queries helped me
        //INSERT INTO user_roles (users_id, role_id)
        //VALUES (
        //    (SELECT id FROM users WHERE user_name = 'admin'),
        //    (SELECT id FROM role WHERE name_role = 'ROLE_ADMIN')
        //);//to insert
        //to delete
        //DELETE FROM user_roles
        //WHERE users_id = (SELECT id FROM users WHERE user_name = 'admin')
        //AND role_id = (SELECT id FROM role WHERE name_role = 'ROLE_USER');

        //now i got both user admin and user role
        //DELETE FROM user_roles
        //WHERE users_id = (SELECT id FROM users WHERE user_name = 'admin')
        //AND role_id = (SELECT id FROM role WHERE name_role = 'ROLE_USER');

        Role role= roleRepository.findByNameRole("ROLE_USER").get();
        //get and add role to the user so that we can pass through it
        user.getRoles().add(role);

        //now save the user using its repo the important part
        userRepository.save(user);

        //now for the response get all the things to show to client using the user response dto

        UserResponseDto userResponseDto= new UserResponseDto();

        userResponseDto.setUsername(user.getUsername());
        userResponseDto.setMessage("User registered successully");

        //now return the userresponse dto

        return userResponseDto;


    }



}
