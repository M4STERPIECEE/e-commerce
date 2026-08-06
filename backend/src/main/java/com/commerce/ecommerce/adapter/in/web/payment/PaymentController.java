package com.commerce.ecommerce.adapter.in.web.payment;

import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.application.port.in.payment.GetPaymentStatusUseCase;
import com.commerce.ecommerce.application.port.in.payment.ProcessPaymentUseCase;
import com.commerce.ecommerce.domain.model.Payment;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/${version.path}/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final ProcessPaymentUseCase processPaymentUseCase;
    private final GetPaymentStatusUseCase getPaymentStatusUseCase;

    @PostMapping("/orders/{orderId}/pay")
    public ResponseEntity<ApiResponse<Payment>> processPayment(@PathVariable UUID orderId) {
        Payment payment = processPaymentUseCase.processPayment(orderId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentStatus(@PathVariable UUID orderId) {
        Payment payment = getPaymentStatusUseCase.getPaymentStatus(orderId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }
}
