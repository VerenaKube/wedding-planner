package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record Table(Integer tableNumber, List<GuestCircle> guests) {

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append("Tisch ").append(tableNumber).append(":\n");
    guests.forEach(builder::append);
    return builder.toString();
  }
}
