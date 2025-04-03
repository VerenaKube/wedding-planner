package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record Table(Integer tableNumber, List<GuestCircle> guests) {}
