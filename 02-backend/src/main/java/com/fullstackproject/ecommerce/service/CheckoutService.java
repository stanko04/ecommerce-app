package com.fullstackproject.ecommerce.service;

import com.fullstackproject.ecommerce.dto.Purchase;
import com.fullstackproject.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    // send back PurchaseResponse
    PurchaseResponse placeOrder(Purchase purchase);
}
