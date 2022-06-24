package com.fullstackproject.ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse {

    // this class send back Java object as JSON

    private final String orderTrackingNumber;

}
