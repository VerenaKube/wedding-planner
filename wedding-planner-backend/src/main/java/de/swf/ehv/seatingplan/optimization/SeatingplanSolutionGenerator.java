package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Age;
import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.GuestCircle;
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
            List<GuestCircle> guestList, TableData tableData, List<SeatingRule> seatingRules, List<Table> tables) {}

    private List<GuestCircle> shuffleGuestList(List<GuestCircle> guestList) {
        var guestCircles = new ArrayList<GuestCircle>();
        Collections.copy(guestCircles, guestList);
        Collections.shuffle(guestCircles);
        return guestCircles;
    }
}
