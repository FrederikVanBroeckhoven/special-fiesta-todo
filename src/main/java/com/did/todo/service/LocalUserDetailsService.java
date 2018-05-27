package com.did.todo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.did.todo.model.User;
import com.did.todo.model.UserDAO;

@Service("userDetailsService")
public class LocalUserDetailsService implements UserDetailsService {

	@Autowired
	private UserDAO userRepository;

	@Transactional(readOnly = true)
	@Override
	public UserDetails loadUserByUsername(final String username) {
		Optional<User> user = userRepository.findByUserName(username);
		if (!user.isPresent()) {
			throw new UsernameNotFoundException(username);
		}
		return new LocalUserDetails(user.get());
/*		return new org.springframework.security.core.userdetails.User(user.get().getUsername(),
				user.get().getPassword(), true, true, true, true,
				Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
*/	}

}
