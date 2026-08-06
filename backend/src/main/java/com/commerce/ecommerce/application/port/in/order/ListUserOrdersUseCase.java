package com.commerce.ecommerce.application.port.in.order;

import com.commerce.ecommerce.domain.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListUserOrdersUseCase {
    Page<Order> listUserOrders(String email, Pageable pageable);
}
