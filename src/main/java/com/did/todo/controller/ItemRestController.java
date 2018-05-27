package com.did.todo.controller;

import java.net.URI;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.did.todo.model.Item;
import com.did.todo.model.ItemRepository;
import com.did.todo.model.User;
import com.did.todo.service.LocalUserDetails;

@RestController
public class ItemRestController {

	@Autowired
	private ItemRepository itemRepository;

	private static User localOwner() {
		return ((LocalUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
	}

	@GetMapping("get/{id}")
	public ResponseEntity<Item> get(@PathVariable("id") Integer id) {
		Optional<Item> item = itemRepository.findByIdAndOwnerId(id, localOwner().getId());
		if (!item.isPresent()) {
			return new ResponseEntity<Item>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Item>(item.get(), HttpStatus.OK);
	}

	@GetMapping("get/all")
	public @ResponseBody Iterable<Item> all() {
		return itemRepository.findByOwnerId(localOwner().getId(), Pageable.unpaged());
	}

	@GetMapping("get/all/{page}/{size}")
	public @ResponseBody Iterable<Item> all(@PathVariable("page") Integer page, @PathVariable("size") Integer size) {
		return itemRepository.findByOwnerId(localOwner().getId(),
				PageRequest.of(page, size, new Sort(Direction.DESC, "timestamp")));
	}

	@PostMapping(path = "/add")
	public ResponseEntity<HttpStatus> add(@RequestBody Item item) {
		item.setTimestamp(new Date());
		item.setOwner(localOwner());
		itemRepository.save(item);
		return ResponseEntity.created(URI.create("/get/" + item.getId())).build();
	}

	@PutMapping(path = "/set")
	public ResponseEntity<HttpStatus> set(@RequestBody Item item) {
		Optional<Item> poss = itemRepository.findByIdAndOwnerId(item.getId(), localOwner().getId());
		if (!poss.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		Item local = poss.get();
		local.setTitle(item.getTitle());
		local.setDescription(item.getDescription());
		itemRepository.save(local);
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@PatchMapping(path = "/check/{id}")
	public ResponseEntity<HttpStatus> check(@PathVariable("id") Integer id, @RequestBody Boolean onf) {
		Optional<Item> poss = itemRepository.findByIdAndOwnerId(id, localOwner().getId());
		if (!poss.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		Item local = poss.get();
		local.setChecked(onf);
		itemRepository.save(local);
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@DeleteMapping(path = "/del/{id}")
	public ResponseEntity<HttpStatus> del(@PathVariable("id") Integer id) {
		Optional<Item> poss = itemRepository.findByIdAndOwnerId(id, localOwner().getId());
		if (!poss.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		Item local = poss.get();
		itemRepository.delete(local);
		return ResponseEntity.ok(HttpStatus.OK);
	}

}
