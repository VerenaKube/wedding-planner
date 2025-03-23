package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record GuestCircle(String name, List<Guest> members) {}
