package de.swf.ehv.seatingplan.persistence.entities;

import java.util.List;

public record SeatingplanSolution(List<Table> tables) {

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append("Solution: ").append("\n");
    tables.forEach(table -> builder.append(table.toString()).append("\n"));
    return builder.toString();
  }
}
