package com.fullstackproject.ecommerce.dto;

import com.fullstackproject.ecommerce.entity.Address;
import com.fullstackproject.ecommerce.entity.Customer;
import com.fullstackproject.ecommerce.entity.Order;
import com.fullstackproject.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
