package com.did.todo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	public @ResponseBody Optional<Item> get(@PathVariable("id") Long id) {
		return itemRepository.findById(id);
	}

	@GetMapping("get/all")
	public @ResponseBody Iterable<Item> all() {
		return itemRepository.findAll();
	}

	@PostMapping(path = "/add")
	public @ResponseBody String add(@RequestParam String title, @RequestParam String description) {
		Item item = new Item();
		item.setTitle(title);
		item.setDescription(description);
		itemRepository.save(item);
		return "OK";
	}

}
