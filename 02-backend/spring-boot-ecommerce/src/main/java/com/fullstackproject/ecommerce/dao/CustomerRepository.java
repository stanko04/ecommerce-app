package com.fullstackproject.ecommerce.dao;


import com.fullstackproject.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
