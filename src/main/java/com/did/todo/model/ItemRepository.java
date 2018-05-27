package com.did.todo.model;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ItemRepository extends PagingAndSortingRepository<Item, Integer> {
	
	public Optional<Item> findByIdAndOwnerId(Integer id, Integer owner);

	public Page<Item> findByOwnerId(Integer owner, Pageable pageable);
	
}