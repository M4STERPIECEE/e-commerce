package com.commerce.ecommerce.adapter.in.web.auth.mapper;

import com.commerce.ecommerce.adapter.in.web.auth.dto.UserProfileResponse;
import com.commerce.ecommerce.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    UserProfileResponse toResponse(User user);
}
