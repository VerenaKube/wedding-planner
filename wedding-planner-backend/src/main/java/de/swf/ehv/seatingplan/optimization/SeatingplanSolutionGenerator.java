package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Age;
import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.GuestCircle;
import de.swf.ehv.seatingplan.persistence.entities.RuleType;
import de.swf.ehv.seatingplan.persistence.entities.SeatingRule;
import de.swf.ehv.seatingplan.persistence.entities.Seatingplan;
import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import de.swf.ehv.seatingplan.persistence.entities.Table;
import de.swf.ehv.seatingplan.persistence.entities.TableData;
import jakarta.annotation.Nonnull;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class SeatingplanSolutionGenerator {

    public @Nonnull SeatingplanSolution generateSeatingplanSolution(@Nonnull Seatingplan seatingplan) {
        var tables = new ArrayList<Table>();
        tables.add(createBasicWeddingTable(seatingplan));

        var guestCircles = shuffleGuestList(seatingplan.getGuestList());
        distributeGuestsToTables(guestCircles, seatingplan.getTableData(), seatingplan.getSeatingRules(), tables);
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
                .filter(guestCircle -> guestCircle.members().stream()
                        .anyMatch(member -> member.groups().contains("Trauzeuge")))
                .toList();
    }

    private void distributeGuestsToTables(
            List<GuestCircle> guestList, TableData tableData, List<SeatingRule> seatingRules, List<Table> tables) {
        guestList.forEach(guestCircle -> {
            var groups = getGroupsFromGuests(guestCircle.members());
            var guestNames = getGuestNamesFromGuests(guestCircle.members());
            var enemies = seatingRules.stream()
                    .filter(seatingRule -> (guestNames.contains(
                                            seatingRule.firstGuest().firstName() + " "
                                                    + seatingRule.firstGuest().lastName())
                                    || guestNames.contains(
                                            seatingRule.secondGuest().firstName() + " "
                                                    + seatingRule.secondGuest().lastName()))
                            && seatingRule.ruleType().equals(RuleType.ENEMY))
                    .map(seatingRule -> {
                        if (guestNames.contains(seatingRule.firstGuest().firstName() + " "
                                + seatingRule.firstGuest().lastName())) {
                            return seatingRule.firstGuest().firstName() + " "
                                    + seatingRule.firstGuest().lastName();
                        }
                        return seatingRule.secondGuest().firstName() + " "
                                + seatingRule.secondGuest().lastName();
                    })
                    .toList();
            // Check existing tables for optimal solution
            var optimalTable = tables.stream()
                    .filter(table -> tableData.seatsPerTable()
                                    >= table.guests().size()
                                            + guestCircle.members().size()
                            && getGroupsFromGuests(table.guests().stream()
                                            .flatMap(circle -> circle.members().stream())
                                            .toList())
                                    .stream()
                                    .anyMatch(groups::contains)
                            && getGuestNamesFromGuests(table.guests().stream()
                                            .flatMap(circle -> circle.members().stream())
                                            .toList())
                                    .stream()
                                    .anyMatch(enemies::contains))
                    .findFirst();
            if (optimalTable.isPresent()) {
                optimalTable.get().guests().add(guestCircle);
            } else {
                // TODO expand
                // Find next best table
                // If no next best table exists create a new one
                // If not possible throw exception
            }
        });
    }

    private List<String> getGroupsFromGuests(List<Guest> guests) {
        return guests.stream()
                .flatMap(guest -> guest.groups().stream().distinct())
                .toList();
    }

    private List<String> getGuestNamesFromGuests(List<Guest> guests) {
        return guests.stream()
                .map(guest -> guest.firstName() + " " + guest.lastName())
                .toList();
    }

    private List<GuestCircle> shuffleGuestList(List<GuestCircle> guestList) {
        var guestCircles = new ArrayList<GuestCircle>();
        Collections.copy(guestCircles, guestList);
        Collections.shuffle(guestCircles);
        return guestCircles;
    }
}
