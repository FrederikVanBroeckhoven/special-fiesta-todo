package com.did.todo.model;

import java.util.Optional;

public interface UserDAO {

	Optional<User> findByUserName(String username);
	
}
