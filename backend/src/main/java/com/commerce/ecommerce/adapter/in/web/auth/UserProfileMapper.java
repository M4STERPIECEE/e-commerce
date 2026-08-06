package com.commerce.ecommerce.adapter.in.web.auth;

import com.commerce.ecommerce.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    UserProfileResponse toResponse(User user);
}
