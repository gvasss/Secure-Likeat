package com.likeat.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    CUSTOMER_READ("customer:read"),
    CUSTOMER_UPDATE("customer:update"),
    CUSTOMER_CREATE("customer:create"),
    CUSTOMER_DELETE("customer:delete"),
    CLIENT_READ("client:read"),
    CLIENT_UPDATE("client:update"),
    CLIENT_CREATE("client:create"),
    CLIENT_DELETE("client:delete"),
    RESTAURANT_READ("restaurant:read"),
    RESTAURANT_UPDATE("restaurant:update"),
    RESTAURANT_CREATE("restaurant:create"),
    RESTAURANT_DELETE("restaurant:delete"),
    REVIEW_READ("review:read"),
    REVIEW_CREATE("review:create"),
    REVIEW_DELETE("review:delete")
    ;

    @Getter
    private final String permission;
}
