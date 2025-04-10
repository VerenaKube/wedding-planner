package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Age;
import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.GuestCircle;
import de.swf.ehv.seatingplan.persistence.entities.GuestMinimal;
import de.swf.ehv.seatingplan.persistence.entities.RuleType;
import de.swf.ehv.seatingplan.persistence.entities.SeatingRule;
import de.swf.ehv.seatingplan.persistence.entities.Seatingplan;
import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import de.swf.ehv.seatingplan.persistence.entities.Table;
import jakarta.annotation.Nonnull;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.function.TriFunction;

@ApplicationScoped
public class SeatingplanSolutionGenerator {

  private static final Map<FilterName, TriFunction<GuestCircle, Seatingplan, Table, Boolean>>
      FILTERS = new HashMap<>();

  static {
    FILTERS.put(
        FilterName.FREE_SEATS_ON_TABLE,
        (guestCircle, seatingplan, table) ->
            seatingplan.getTableData().seatsPerTable()
                >= table.guests().size() + guestCircle.members().size());
    FILTERS.put(
        FilterName.OTHER_GUESTS_OF_SAME_GROUP_ON_TABLE,
        ((guestCircle, seatingplan, table) ->
            getGroupsFromGuests(
                    table.guests().stream().flatMap(circle -> circle.members().stream()).toList())
                .stream()
                .anyMatch(groups -> getGroupsFromGuests(guestCircle.members()).contains(groups))));
    FILTERS.put(
        FilterName.NO_ENEMIES_ON_TABLE,
        (guestCircle, seatingplan, table) ->
            getGuestNamesFromGuests(
                    table.guests().stream().flatMap(circle -> circle.members().stream()).toList())
                .stream()
                .noneMatch(
                    names ->
                        getEnemieNamesFromSeatingRules(seatingplan.getSeatingRules(), guestCircle)
                            .contains(names)));
  }

  public @Nonnull SeatingplanSolution generateSeatingplanSolution(
      @Nonnull Seatingplan seatingplan) {
    var tables = new ArrayList<Table>();
    tables.add(createBasicWeddingTable(seatingplan));

    var guestCircles = shuffleGuestList(seatingplan.getGuestList());
    distributeGuestsToTables(guestCircles, seatingplan, tables);
    return new SeatingplanSolution(seatingplan.getId(), tables);
  }

  private Table createBasicWeddingTable(Seatingplan seatingplan) {
    var tableMembers = new ArrayList<GuestCircle>();
    tableMembers.add(createBrautpaarGuestCircle(seatingplan.getBride(), seatingplan.getGroom()));
    tableMembers.addAll(findWitnessGuestCircles(seatingplan.getGuestList()));
    return new Table(1, tableMembers);
  }

  private GuestCircle createBrautpaarGuestCircle(String brideName, String groomName) {
    var bride = new Guest(brideName, "(Braut)", Age.ADULT, Collections.emptyList());
    var groom = new Guest(groomName, "(Bräutigam)", Age.ADULT, Collections.emptyList());
    return new GuestCircle("Brautpaar", List.of(bride, groom));
  }

  private List<GuestCircle> findWitnessGuestCircles(List<GuestCircle> guestList) {
    return guestList.stream()
        .filter(
            guestCircle ->
                guestCircle.members().stream()
                    .anyMatch(member -> member.groups().contains("Trauzeuge")))
        .toList();
  }

  private void distributeGuestsToTables(
      List<GuestCircle> guestList, Seatingplan seatingplan, List<Table> tables) {
    guestList.forEach(
        guestCircle -> {
          // Check existing tables for optimal solution
          var optimalTable =
              tables.stream()
                  .filter(
                      table ->
                          FILTERS
                                  .get(FilterName.FREE_SEATS_ON_TABLE)
                                  .apply(guestCircle, seatingplan, table)
                              && FILTERS
                                  .get(FilterName.OTHER_GUESTS_OF_SAME_GROUP_ON_TABLE)
                                  .apply(guestCircle, seatingplan, table)
                              && FILTERS
                                  .get(FilterName.NO_ENEMIES_ON_TABLE)
                                  .apply(guestCircle, seatingplan, table))
                  .findFirst();
          if (optimalTable.isPresent()) {
            optimalTable.get().guests().add(guestCircle);
          } else {
            // Find next best table
            var nextBestTable =
                tables.stream()
                    .filter(
                        table ->
                            FILTERS
                                    .get(FilterName.FREE_SEATS_ON_TABLE)
                                    .apply(guestCircle, seatingplan, table)
                                && (FILTERS
                                        .get(FilterName.OTHER_GUESTS_OF_SAME_GROUP_ON_TABLE)
                                        .apply(guestCircle, seatingplan, table)
                                    || FILTERS
                                        .get(FilterName.NO_ENEMIES_ON_TABLE)
                                        .apply(guestCircle, seatingplan, table)))
                    .findFirst();
            if (nextBestTable.isPresent()) {
              nextBestTable.get().guests().add(guestCircle);
            } else {
              if (tables.size() < seatingplan.getTableData().numberOfTables()) {
                var members = new ArrayList<GuestCircle>();
                members.add(guestCircle);
                tables.add(new Table(tables.size() + 1, members));
              } else {
                tables.stream()
                    .filter(
                        table ->
                            FILTERS
                                .get(FilterName.FREE_SEATS_ON_TABLE)
                                .apply(guestCircle, seatingplan, table))
                    .findFirst()
                    .ifPresentOrElse(
                        table -> table.guests().add(guestCircle),
                        () -> {
                          throw new IllegalArgumentException("No available table for guests found");
                        });
              }
            }
          }
        });
  }

  private static List<String> getGroupsFromGuests(List<Guest> guests) {
    return guests.stream().flatMap(guest -> guest.groups().stream().distinct()).toList();
  }

  private static List<String> getGuestNamesFromGuests(List<Guest> guests) {
    return guests.stream().map(guest -> guest.firstName() + " " + guest.lastName()).toList();
  }

  private static String getGuestNameFromGuest(GuestMinimal guest) {
    return guest.firstName() + " " + guest.lastName();
  }

  private static List<String> getEnemieNamesFromSeatingRules(
      List<SeatingRule> seatingRules, GuestCircle guestCircle) {
    var guestNames = getGuestNamesFromGuests(guestCircle.members());
    return seatingRules.stream()
        .filter(
            seatingRule ->
                (guestNames.contains(getGuestNameFromGuest(seatingRule.firstGuest()))
                        || guestNames.contains(getGuestNameFromGuest(seatingRule.secondGuest())))
                    && seatingRule.ruleType().equals(RuleType.ENEMY))
        .map(
            seatingRule -> {
              if (guestNames.contains(getGuestNameFromGuest(seatingRule.firstGuest()))) {
                return getGuestNameFromGuest(seatingRule.firstGuest());
              }
              return getGuestNameFromGuest(seatingRule.secondGuest());
            })
        .toList();
  }

  private List<GuestCircle> shuffleGuestList(List<GuestCircle> guestList) {
    var guestCircles = new ArrayList<GuestCircle>();
    Collections.copy(guestCircles, guestList);
    Collections.shuffle(guestCircles);
    return guestCircles;
  }

  private enum FilterName {
    FREE_SEATS_ON_TABLE,
    OTHER_GUESTS_OF_SAME_GROUP_ON_TABLE,
    NO_ENEMIES_ON_TABLE
  }
}
