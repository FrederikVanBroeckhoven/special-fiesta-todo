package com.did.todo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.did.todo.model.Item;
import com.did.todo.model.ItemRepository;

@RestController
public class ItemRestController {

	@Autowired
	private ItemRepository itemRepository;

	@GetMapping("get/{id}")
	public ResponseEntity<Item> get(@PathVariable("id") Integer id) {
		Optional<Item> item = itemRepository.findById(id);
		if (!item.isPresent()) {
			return new ResponseEntity<Item>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Item>(item.get(), HttpStatus.OK);
	}

	@GetMapping("get/all")
	public @ResponseBody Iterable<Item> all() {
		return itemRepository.findAll();
	}

	@PostMapping(path = "/add")
	public ResponseEntity<HttpStatus> add(@RequestParam String title, @RequestParam String description) {
		Item item = new Item();
		item.setTitle(title);
		item.setDescription(description);
		itemRepository.save(item);
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@PutMapping(path = "/set/{id}")
	public ResponseEntity<HttpStatus> set(@PathVariable("id") Integer id, @RequestParam String title,
			@RequestParam String description) {
		Optional<Item> itemOpt = itemRepository.findById(id);
		if (!itemOpt.isPresent()) {
			return new ResponseEntity<HttpStatus>(HttpStatus.NOT_FOUND);
		}
		Item item = itemOpt.get();
		item.setTitle(title);
		item.setDescription(description);
		itemRepository.save(item);
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@PatchMapping(path = "/check/{id}")
	public ResponseEntity<HttpStatus> check(@PathVariable("id") Integer id, @RequestParam Boolean onf) {
		Optional<Item> itemOpt = itemRepository.findById(id);
		if (!itemOpt.isPresent()) {
			return new ResponseEntity<HttpStatus>(HttpStatus.NOT_FOUND);
		}
		Item item = itemOpt.get();
		item.setChecked(onf);
		itemRepository.save(item);
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@DeleteMapping(path = "/del/{id}")
	public ResponseEntity<HttpStatus> del(@PathVariable("id") Integer id) {
		Optional<Item> itemOpt = itemRepository.findById(id);
		if (!itemOpt.isPresent()) {
			return new ResponseEntity<HttpStatus>(HttpStatus.NOT_FOUND);
		}
		Item item = itemOpt.get();
		itemRepository.delete(item);
		return ResponseEntity.ok(HttpStatus.OK);
	}

}
