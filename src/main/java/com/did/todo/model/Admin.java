package com.did.todo.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;

@Entity
public class Admin {
	@Id
	private Integer id;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	private User user;
}
