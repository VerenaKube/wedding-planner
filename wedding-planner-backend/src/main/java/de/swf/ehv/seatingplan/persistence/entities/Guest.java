package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record Guest(String firstName, String lastName, Age age, List<String> group) {}
