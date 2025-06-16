package com.example.saleshop_be;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Data
@SpringBootApplication
public class SaleshopBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaleshopBeApplication.class, args);
	}

}
