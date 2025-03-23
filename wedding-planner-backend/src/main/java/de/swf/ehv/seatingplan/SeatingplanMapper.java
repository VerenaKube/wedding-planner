package de.swf.ehv.seatingplan;

import de.swf.ehv.planner.generated.api.model.*;
import de.swf.ehv.seatingplan.persistence.entities.*;
import de.swf.ehv.seatingplan.persistence.entities.Age;
import de.swf.ehv.seatingplan.persistence.entities.TableType;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class SeatingplanMapper {

    public Seatingplan toSeatingplan(SeatingplanCreationRequest seatingplanCreationRequest) {
        return Seatingplan.builder()
                .id(UUID.randomUUID())
                .name(seatingplanCreationRequest.getName())
                .bride(seatingplanCreationRequest.getBride())
                .groom(seatingplanCreationRequest.getGroom())
                .weddingDate(seatingplanCreationRequest.getWeddingDate())
                .build();
    }

    public Seatingplan toSeatingplan(SeatingplanDto seatingplanDto) {
        return Seatingplan.builder()
                .id(seatingplanDto.getId())
                .name(seatingplanDto.getName())
                .bride(seatingplanDto.getBride())
                .groom(seatingplanDto.getGroom())
                .weddingDate(seatingplanDto.getWeddingDate())
                .guestList(toGuestList(seatingplanDto.getGuestList()))
                .tableData(toTableData(seatingplanDto.getTableData()))
                .seatingRules(toSeatingRules(seatingplanDto.getSeatingRules()))
                .build();
    }

    private List<GuestCircle> toGuestList(List<GuestCircleDto> guestList) {
        return guestList.stream().map(this::toGuestCircle).collect(Collectors.toList());
    }

    private GuestCircle toGuestCircle(GuestCircleDto guestCircleDto) {
        return new GuestCircle(
                guestCircleDto.getName(),
                guestCircleDto.getMembers().stream().map(this::toGuest).collect(Collectors.toList()));
    }

    private Guest toGuest(GuestDto guestDto) {
        return new Guest(
                guestDto.getFirstName(),
                guestDto.getLastName(),
                Age.valueOf(guestDto.getAge().toString()),
                guestDto.getGroups());
    }

    private TableData toTableData(TableDataDto tableDataDto) {
        return new TableData(
                TableType.valueOf(tableDataDto.getType().toString()),
                tableDataDto.getSeatsPerTable(),
                tableDataDto.getNumberOfTables());
    }

    private List<SeatingRule> toSeatingRules(List<SeatingRuleDto> seatingRuleDtoList) {
        return seatingRuleDtoList.stream().map(this::toSeatingRule).collect(Collectors.toList());
    }

    private SeatingRule toSeatingRule(SeatingRuleDto seatingRuleDto) {
        return new SeatingRule(seatingRuleDto.getId());
    }
}
