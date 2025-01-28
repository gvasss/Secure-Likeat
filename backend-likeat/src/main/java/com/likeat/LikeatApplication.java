package com.likeat;

import com.likeat.auth.RegisterRequest;
import com.likeat.service.AuthenticationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import static com.likeat.model.Role.*;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class LikeatApplication {

    public static void main(String[] args) {
        SpringApplication.run(LikeatApplication.class, args);
    }

//    @Bean
//    public CommandLineRunner commandLineRunner(AuthenticationService service) {
//        return args -> {
//            var admin = RegisterRequest.builder()
//                    .username("admin")
//                    .name("admin")
//                    .surname("admin")
//                    .email("admin@mail.com")
//                    .password("admin")
//                    .role(ADMIN)
//                    .build();
//            System.out.println("Admin token: " + service.register(admin).getAccessToken());
//
//            var customer = RegisterRequest.builder()
//                    .username("customer")
//                    .name("customer")
//                    .surname("customer")
//                    .email("customer@mail.com")
//                    .password("customer")
//                    .role(CUSTOMER)
//                    .build();
//            System.out.println("Customer token: " + service.register(customer).getAccessToken());
//
//            var client = RegisterRequest.builder()
//                    .username("client")
//                    .name("client")
//                    .surname("client")
//                    .email("client@mail.com")
//                    .password("client")
//                    .role(CLIENT)
//                    .build();
//            System.out.println("Client token: " + service.register(client).getAccessToken());
//        };
//    }
}