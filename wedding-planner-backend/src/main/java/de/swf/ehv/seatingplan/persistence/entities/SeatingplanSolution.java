package de.swf.ehv.seatingplan.persistence.entities;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.codecs.pojo.annotations.BsonId;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatingplanSolution extends PanacheMongoEntityBase {

  @BsonId private UUID id;

  private List<Table> tables;

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append("Solution: ").append(id).append(":").append("\n");
    tables.forEach(table -> builder.append(table.toString()).append("\n"));
    return builder.toString();
  }
}
