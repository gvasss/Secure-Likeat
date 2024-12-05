package com.likeat.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.likeat.model.Permission.*;

@RequiredArgsConstructor
public enum Role {

    USER(Collections.emptySet()),
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE,
                    CUSTOMER_READ,
                    CUSTOMER_DELETE,
                    CLIENT_READ,
                    CLIENT_DELETE,
                    RESTAURANT_READ,
                    RESTAURANT_DELETE,
                    RESTAURANT_UPDATE
            )
    ),
    CUSTOMER(
            Set.of(
                    CUSTOMER_READ,
                    CUSTOMER_UPDATE,
                    CUSTOMER_DELETE,
                    CUSTOMER_CREATE,
                    RESTAURANT_READ,
                    REVIEW_CREATE,
                    REVIEW_READ
            )
    ),
    CLIENT(
            Set.of(
                    CLIENT_READ,
                    CLIENT_UPDATE,
                    CLIENT_DELETE,
                    CLIENT_CREATE,
                    RESTAURANT_READ,
                    RESTAURANT_CREATE,
                    RESTAURANT_UPDATE,
                    RESTAURANT_DELETE,
                    REVIEW_READ
            )
  );

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}