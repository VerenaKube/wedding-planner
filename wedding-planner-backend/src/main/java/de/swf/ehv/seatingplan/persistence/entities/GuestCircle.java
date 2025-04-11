package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record GuestCircle(String name, List<Guest> members) {

  @Override
  public String toString() {
    var builder = new StringBuilder();
    builder.append("->\n");
    members.forEach(member -> builder.append("\t").append(member).append("\n"));
    builder.append("<-\n");
    return builder.toString();
  }
}
