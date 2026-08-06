package com.commerce.ecommerce.adapter.in.web.payment;

import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.application.port.in.payment.GetPaymentStatusUseCase;
import com.commerce.ecommerce.application.port.in.payment.ProcessPaymentUseCase;
import com.commerce.ecommerce.domain.model.Payment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payments")
public class PaymentController {

    private final ProcessPaymentUseCase processPaymentUseCase;
    private final GetPaymentStatusUseCase getPaymentStatusUseCase;

    @PostMapping("/orders/{orderId}/pay")
    @Operation(summary = "Process payment for an order (mock)")
    public ResponseEntity<ApiResponse<Payment>> processPayment(@PathVariable UUID orderId) {
        Payment payment = processPaymentUseCase.processPayment(orderId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Get payment status for an order")
    public ResponseEntity<ApiResponse<Payment>> getPaymentStatus(@PathVariable UUID orderId) {
        Payment payment = getPaymentStatusUseCase.getPaymentStatus(orderId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }
}
