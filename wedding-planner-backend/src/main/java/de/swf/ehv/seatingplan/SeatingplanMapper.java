package de.swf.ehv.seatingplan;

import de.swf.ehv.planner.generated.api.model.GuestCircleDto;
import de.swf.ehv.planner.generated.api.model.GuestDto;
import de.swf.ehv.planner.generated.api.model.GuestMinimalDto;
import de.swf.ehv.planner.generated.api.model.SeatingRuleDto;
import de.swf.ehv.planner.generated.api.model.SeatingplanCreationRequest;
import de.swf.ehv.planner.generated.api.model.SeatingplanDto;
import de.swf.ehv.planner.generated.api.model.SeatingplanSolutionDto;
import de.swf.ehv.planner.generated.api.model.TableDataDto;
import de.swf.ehv.planner.generated.api.model.TableDto;
import de.swf.ehv.seatingplan.persistence.entities.Age;
import de.swf.ehv.seatingplan.persistence.entities.Guest;
import de.swf.ehv.seatingplan.persistence.entities.GuestCircle;
import de.swf.ehv.seatingplan.persistence.entities.GuestMinimal;
import de.swf.ehv.seatingplan.persistence.entities.RuleType;
import de.swf.ehv.seatingplan.persistence.entities.SeatingRule;
import de.swf.ehv.seatingplan.persistence.entities.Seatingplan;
import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import de.swf.ehv.seatingplan.persistence.entities.Table;
import de.swf.ehv.seatingplan.persistence.entities.TableData;
import de.swf.ehv.seatingplan.persistence.entities.TableType;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
    return Optional.ofNullable(guestList)
        .map(circles -> circles.stream().map(this::toGuestCircle).collect(Collectors.toList()))
        .orElse(Collections.emptyList());
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
    return Optional.ofNullable(tableDataDto)
        .map(
            dto ->
                new TableData(
                    TableType.valueOf(dto.getType().toString()),
                    dto.getSeatsPerTable(),
                    dto.getNumberOfTables()))
        .orElse(null);
  }

  private List<SeatingRule> toSeatingRules(List<SeatingRuleDto> seatingRuleDtoList) {
    return Optional.ofNullable(seatingRuleDtoList)
        .map(rules -> rules.stream().map(this::toSeatingRule).collect(Collectors.toList()))
        .orElse(Collections.emptyList());
  }

  private SeatingRule toSeatingRule(SeatingRuleDto seatingRuleDto) {
    return new SeatingRule(
        Optional.ofNullable(seatingRuleDto.getId()).orElse(UUID.randomUUID()),
        RuleType.valueOf(seatingRuleDto.getRuleType().toString()),
        toGuestMinimal(seatingRuleDto.getFirstGuest()),
        toGuestMinimal(seatingRuleDto.getSecondGuest()));
  }

  private GuestMinimal toGuestMinimal(GuestMinimalDto guestMinimalDto) {
    return new GuestMinimal(guestMinimalDto.getFirstName(), guestMinimalDto.getLastName());
  }

  public SeatingplanSolutionDto fromSeatingplanSolution(SeatingplanSolution seatingplanSolution) {
    return Optional.ofNullable(seatingplanSolution)
        .map(
            solution ->
                SeatingplanSolutionDto.builder()
                    .id(solution.getId())
                    .tables(fromTables(solution.getTables()))
                    .build())
        .orElse(null);
  }

  private List<TableDto> fromTables(List<Table> tables) {
    return Optional.ofNullable(tables)
        .map(t -> t.stream().map(this::fromTable).collect(Collectors.toList()))
        .orElse(Collections.emptyList());
  }

  private TableDto fromTable(Table table) {
    return TableDto.builder()
        .tableNumber(table.tableNumber())
        .guests(fromGuestList(table.guests()))
        .build();
  }

  public SeatingplanDto fromSeatingplan(Seatingplan seatingplan) {
    return SeatingplanDto.builder()
        .id(seatingplan.getId())
        .name(seatingplan.getName())
        .bride(seatingplan.getBride())
        .groom(seatingplan.getGroom())
        .weddingDate(seatingplan.getWeddingDate())
        .guestList(fromGuestList(seatingplan.getGuestList()))
        .tableData(fromTableData(seatingplan.getTableData()))
        .seatingRules(fromSeatingRules(seatingplan.getSeatingRules()))
        .build();
  }

  private List<GuestCircleDto> fromGuestList(List<GuestCircle> guestList) {
    return Optional.ofNullable(guestList)
        .map(guests -> guests.stream().map(this::fromGuestCircle).collect(Collectors.toList()))
        .orElse(Collections.emptyList());
  }

  private GuestCircleDto fromGuestCircle(GuestCircle guestCircle) {
    return GuestCircleDto.builder()
        .name(guestCircle.name())
        .members(guestCircle.members().stream().map(this::fromGuest).toList())
        .build();
  }

  private GuestDto fromGuest(Guest guest) {
    return GuestDto.builder()
        .firstName(guest.firstName())
        .lastName(guest.lastName())
        .age(de.swf.ehv.planner.generated.api.model.Age.valueOf(guest.age().toString()))
        .groups(guest.groups())
        .build();
  }

  private TableDataDto fromTableData(TableData tableData) {
    return Optional.ofNullable(tableData)
        .map(
            data ->
                TableDataDto.builder()
                    .numberOfTables(data.numberOfTables())
                    .seatsPerTable(data.seatsPerTable())
                    .type(
                        de.swf.ehv.planner.generated.api.model.TableType.valueOf(
                            data.type().toString()))
                    .build())
        .orElse(null);
  }

  private List<SeatingRuleDto> fromSeatingRules(List<SeatingRule> seatingRules) {
    return Optional.ofNullable(seatingRules)
        .map(rules -> rules.stream().map(this::fromSeatingRule).collect(Collectors.toList()))
        .orElse(Collections.emptyList());
  }

  private SeatingRuleDto fromSeatingRule(SeatingRule seatingRule) {
    return SeatingRuleDto.builder()
        .id(seatingRule.id())
        .ruleType(
            de.swf.ehv.planner.generated.api.model.RuleType.valueOf(
                seatingRule.ruleType().toString()))
        .firstGuest(fromGuestMinimal(seatingRule.firstGuest()))
        .secondGuest(fromGuestMinimal(seatingRule.secondGuest()))
        .build();
  }

  private GuestMinimalDto fromGuestMinimal(GuestMinimal guestMinimal) {
    return GuestMinimalDto.builder()
        .firstName(guestMinimal.firstName())
        .lastName(guestMinimal.lastName())
        .build();
  }
}
