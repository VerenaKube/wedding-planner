package de.swf.ehv.seatingplan;

import de.swf.ehv.planner.generated.api.model.SeatingplanCreationRequest;
import de.swf.ehv.planner.generated.api.model.SeatingplanDto;
import de.swf.ehv.planner.generated.api.model.SeatingplanSolutionDto;
import de.swf.ehv.planner.generated.api.model.ValidationResponse;
import de.swf.ehv.seatingplan.optimization.SeatingplanOptimizer;
import de.swf.ehv.seatingplan.persistence.SeatingplanRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;

@ApplicationScoped
@RequiredArgsConstructor
public class SeatingplanService {

  private final SeatingplanRepository repository;

  private final SeatingplanOptimizer optimizer;

  private final SeatingplanMapper mapper;

  public List<SeatingplanDto> getAllSeatingplans() {
    return repository.findAll().stream().map(mapper::fromSeatingplan).toList();
  }

  public UUID createSeatingplan(SeatingplanCreationRequest seatingplanCreationRequest) {
    var seatingplan = mapper.toSeatingplan(seatingplanCreationRequest);
    repository.persist(seatingplan);
    return seatingplan.getId();
  }

  public SeatingplanDto getSeatingplanById(UUID id) {
    var seatingplan = repository.findByIdOptional(id).orElseThrow();
    return mapper.fromSeatingplan(seatingplan);
  }

  public void updateSeatingplan(SeatingplanDto seatingplanDto) {
    repository.update(mapper.toSeatingplan(seatingplanDto));
  }

  public void deleteSeatingplan(UUID id) {
    if (repository.deleteById(id)) {
      throw new NoSuchElementException("Seatingplan with id " + id + " not found");
    }
  }

  public ValidationResponse validateSeatingplan(UUID id) {
    var seatingplan = repository.findByIdOptional(id).orElseThrow();
    var messages = new ArrayList<String>();

    var numberOfGuests =
        seatingplan.getGuestList().stream()
            .mapToInt(guestCircle -> guestCircle.members().size())
            .sum();
    var numberOfSeats =
        seatingplan.getTableData().numberOfTables() * seatingplan.getTableData().seatsPerTable();

    if (numberOfGuests > numberOfSeats) {
      messages.add("Not enough seats for the given number of guests");
    }

    // TODO add more validations

    return ValidationResponse.builder().messages(messages).build();
  }

  public SeatingplanSolutionDto generateSeatingplanSolution(UUID id) {
    var seatingplan = repository.findByIdOptional(id).orElseThrow();
    return mapper.fromSeatingplanSolution(optimizer.optimize(seatingplan));
  }
}
