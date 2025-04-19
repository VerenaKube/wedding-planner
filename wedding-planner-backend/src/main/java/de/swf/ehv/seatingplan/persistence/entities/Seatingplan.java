package de.swf.ehv.seatingplan.persistence.entities;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.*;
import org.bson.codecs.pojo.annotations.BsonId;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seatingplan extends PanacheMongoEntityBase {

  @BsonId private UUID id;

  private String name;
  private LocalDate weddingDate;
  private String bride;
  private String groom;
  private List<GuestCircle> guestList;
  private TableData tableData;
  private List<SeatingRule> seatingRules;
  private SeatingplanSolution solution;
}
