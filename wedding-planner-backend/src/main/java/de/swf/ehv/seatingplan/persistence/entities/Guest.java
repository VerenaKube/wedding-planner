package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record Guest(String firstName, String lastName, Age age, List<String> groups) {

  @Override
  public String toString() {
    var builder = new StringBuilder().append(firstName).append(" ").append(lastName);
    builder.append(" (");
    groups.forEach(group -> builder.append(group).append(", "));
    builder.append(")");
    return builder.toString();
  }
}
