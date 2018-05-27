package com.did.todo.model;

import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAOImpl implements UserDAO {

	@Autowired
	private EntityManager entityManager;

	private Session getSession() {
		return entityManager.unwrap(Session.class);
	}

	public Optional<User> findByUserName(String username) {
		try {
			return Optional.ofNullable((User) getSession().createQuery("from User where username=?")
					.setParameter(0, username).getSingleResult());
		} catch (NoResultException nre) {
			return Optional.empty();
		}
	}
}
