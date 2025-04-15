package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import de.swf.ehv.seatingplan.persistence.entities.Table;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@ApplicationScoped
public class SeatingplanMutator {

  public List<SeatingplanSolution> mutateSeatingplanSolutions(
      List<SeatingplanSolution> seatingplanSolutions, int amount) {
    var counter = (amount - seatingplanSolutions.size()) / 2;
    var mutatedSolutions = new ArrayList<SeatingplanSolution>();

    SeatingplanSolution firstSolution = seatingplanSolutions.getFirst();
    SeatingplanSolution secondSolution = seatingplanSolutions.getFirst();
    for (int i = 0; i < counter; i++) {
      while (!firstSolution.equals(secondSolution)) {
        firstSolution =
            seatingplanSolutions.get(
                ThreadLocalRandom.current().nextInt(seatingplanSolutions.size()));
        secondSolution =
            seatingplanSolutions.get(
                ThreadLocalRandom.current().nextInt(seatingplanSolutions.size()));
      }
      var mutatedSolution = SeatingplanSolution.builder().id(firstSolution.getId()).build();

      Table firstTable;
      Table secondTable;
      do {
        firstTable =
            firstSolution
                .getTables()
                .get(ThreadLocalRandom.current().nextInt(firstSolution.getTables().size()));
        secondTable =
            secondSolution
                .getTables()
                .get(ThreadLocalRandom.current().nextInt(secondSolution.getTables().size()));

      } while (noDuplicateGuestsOnTables(firstTable, secondTable));
      mutatedSolutions.add(mutatedSolution);
    }
    return mutatedSolutions;
  }

  private boolean noDuplicateGuestsOnTables(Table firstTable, Table secondTable) {
    var firstGuestList =
        firstTable.guests().stream()
            .flatMap(guestCircle -> guestCircle.members().stream())
            .map(this::mapGuestToName)
            .toList();
    var secondGuestList =
        secondTable.guests().stream()
            .flatMap(guestCircle -> guestCircle.members().stream())
            .map(this::mapGuestToName)
            .toList();
    return firstGuestList.stream().anyMatch(secondGuestList::contains);
  }

  private String mapGuestToName(Guest guest) {
    return guest.firstName() + " " + guest.lastName();
  }
}
