package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.GuestCircle;
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
      var mutatedSolution = new SeatingplanSolution(new ArrayList<>());

      List<GuestCircle> firstTable;
      List<GuestCircle> secondTable;
      do {
        firstTable =
            firstSolution
                .tables()
                .get(ThreadLocalRandom.current().nextInt(firstSolution.tables().size()))
                .guests();
        secondTable =
            secondSolution
                .tables()
                .get(ThreadLocalRandom.current().nextInt(secondSolution.tables().size()))
                .guests();

      } while (noDuplicateGuestsOnTables(firstTable, secondTable));

      var secondTableNumber = tableContainsWeddingPair(firstTable) ? 2 : 3;

      mutatedSolution
          .tables()
          .add(new Table(tableContainsWeddingPair(firstTable) ? 1 : 2, firstTable));
      mutatedSolution
          .tables()
          .add(
              new Table(
                  tableContainsWeddingPair(secondTable) ? 1 : secondTableNumber, secondTable));
      mutatedSolutions.add(mutatedSolution);
    }
    return mutatedSolutions;
  }

  private boolean noDuplicateGuestsOnTables(
      List<GuestCircle> firstTable, List<GuestCircle> secondTable) {
    var firstGuestList =
        firstTable.stream()
            .flatMap(guestCircle -> guestCircle.members().stream())
            .map(this::mapGuestToName)
            .toList();
    var secondGuestList =
        secondTable.stream()
            .flatMap(guestCircle -> guestCircle.members().stream())
            .map(this::mapGuestToName)
            .toList();
    return firstGuestList.stream().anyMatch(secondGuestList::contains);
  }

  private boolean tableContainsWeddingPair(List<GuestCircle> table) {
    return table.stream()
        .flatMap(guestCircle -> guestCircle.members().stream())
        .map(Guest::lastName)
        .anyMatch(lastName -> lastName.contains("(Braut)"));
  }

  private String mapGuestToName(Guest guest) {
    return guest.firstName() + " " + guest.lastName();
  }
}
