package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.GuestMinimal;
import de.swf.ehv.seatingplan.persistence.entities.RuleType;
import de.swf.ehv.seatingplan.persistence.entities.SeatingRule;
import de.swf.ehv.seatingplan.persistence.entities.Seatingplan;
import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import de.swf.ehv.seatingplan.persistence.entities.Table;
import de.swf.ehv.seatingplan.persistence.entities.TableData;
import jakarta.annotation.Nonnull;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class SeatingplanSolutionEvaluator {

  public Integer evaluateSeatingplanSolution(
      @Nonnull SeatingplanSolution seatingplanSolution, Seatingplan seatingplan) {
    var tables = seatingplanSolution.getTables();
    var tableData = seatingplan.getTableData();
    var seatingRules = seatingplan.getSeatingRules();
    var freeSeatsOnUsedTables = countFreeSeats(tables, tableData);
    var differenceBetweenBiggestAndSmallestTable =
        determineDifferenceBetweenBiggestAndSmallestTable(tables, tableData.seatsPerTable());
    var enemiesSittingTogether = countEnemiesSittingTogether(tables, seatingRules);
    var friendsSittingTogether = countFriendsSittingTogether(tables, seatingRules);
    var groupsSittingTogether = determineGroupsSittingTogether(tables);
    var guestsOfSameAgeSittingTogether = determineGuestsOfSameAgeSittingTogether(tables);

    return friendsSittingTogether
        + groupsSittingTogether
        + guestsOfSameAgeSittingTogether
        - freeSeatsOnUsedTables
        - differenceBetweenBiggestAndSmallestTable
        - enemiesSittingTogether;
  }

  private Integer countFreeSeats(List<Table> tables, TableData tableData) {
    var availableSeats = tables.size() * tableData.seatsPerTable();
    return availableSeats
        - tables.stream()
            .flatMap(table -> table.guests().stream())
            .mapToInt(circle -> circle.members().size())
            .sum();
  }

  private Integer determineDifferenceBetweenBiggestAndSmallestTable(
      List<Table> tables, int seatsPerTable) {
    var max =
        tables.stream()
            .flatMap(table -> table.guests().stream())
            .mapToInt(guest -> guest.members().size())
            .max()
            .orElse(seatsPerTable);
    var min =
        tables.stream()
            .flatMap(table -> table.guests().stream())
            .mapToInt(guest -> guest.members().size())
            .min()
            .orElse(0);
    return max - min;
  }

  private Integer countEnemiesSittingTogether(List<Table> tables, List<SeatingRule> seatingRules) {
    return countRuleMatchesOnTables(tables, seatingRules, RuleType.ENEMY);
  }

  private Integer countFriendsSittingTogether(List<Table> tables, List<SeatingRule> seatingRules) {
    return countRuleMatchesOnTables(tables, seatingRules, RuleType.FRIEND);
  }

  private Integer countRuleMatchesOnTables(
      List<Table> tables, List<SeatingRule> seatingRules, RuleType ruleType) {
    var enemyPairCounter = 0;
    for (var table : tables) {
      var guestsAtTable =
          table.guests().stream()
              .flatMap(guest -> guest.members().stream())
              .map(this::mapGuestToName)
              .toList();
      enemyPairCounter +=
          (int)
              seatingRules.stream()
                  .filter(seatingRule -> seatingRule.ruleType().equals(ruleType))
                  .filter(
                      seatingRule ->
                          guestsAtTable.contains(mapGuestToName(seatingRule.firstGuest()))
                              && guestsAtTable.contains(mapGuestToName(seatingRule.secondGuest())))
                  .count();
    }
    return enemyPairCounter;
  }

  private Integer determineGroupsSittingTogether(List<Table> tables) {
    var groupingCounter = 0;
    for (var table : tables) {
      for (var circle : table.guests()) {
        var circleGroups =
            circle.members().stream().flatMap(guest -> guest.groups().stream()).toList();
        groupingCounter +=
            (int)
                table.guests().stream()
                    .filter(guests -> !circle.name().equals(guests.name()))
                    .flatMap(guests -> guests.members().stream())
                    .filter(member -> member.groups().stream().anyMatch(circleGroups::contains))
                    .count();
      }
    }
    return groupingCounter;
  }

  private Integer determineGuestsOfSameAgeSittingTogether(List<Table> tables) {
    var sameAgeCounter = 0;
    for (var table : tables) {
      for (var circle : table.guests()) {
        var ageGroups = circle.members().stream().map(Guest::age).toList();
        sameAgeCounter +=
            (int)
                table.guests().stream()
                    .filter(guests -> !guests.name().equals(circle.name()))
                    .flatMap(guests -> guests.members().stream())
                    .filter(guest -> ageGroups.contains(guest.age()))
                    .count();
      }
    }
    return sameAgeCounter;
  }

  private String mapGuestToName(Guest guest) {
    return guest.firstName() + " " + guest.lastName();
  }

  private String mapGuestToName(GuestMinimal guest) {
    return guest.firstName() + " " + guest.lastName();
  }
}
