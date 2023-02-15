package com.fullstackproject.ecommerce;

import com.fullstackproject.ecommerce.entity.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@SpringBootApplication

public class SpringBootEcommerceApplication implements RepositoryRestConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootEcommerceApplication.class, args);
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		config.exposeIdsFor(Product.class);
		config.exposeIdsFor(ProductCategory.class);
		config.exposeIdsFor(Address.class);
		config.exposeIdsFor(Customer.class);
		config.exposeIdsFor(Order.class);
		config.exposeIdsFor(OrderItem.class);
	}
}
