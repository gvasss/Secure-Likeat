package com.likeat.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdateUserRequest {
        private String email;
        private String name;
        private String surname;
}