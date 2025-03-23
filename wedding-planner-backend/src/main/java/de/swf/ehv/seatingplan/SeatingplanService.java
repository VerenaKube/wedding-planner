package de.swf.ehv.seatingplan;

import de.swf.ehv.planner.generated.api.model.SeatingplanCreationRequest;
import de.swf.ehv.seatingplan.persistence.SeatingplanRepository;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@ApplicationScoped
@RequiredArgsConstructor
public class SeatingplanService {

    private final SeatingplanRepository repository;

    private final SeatingplanMapper mapper;

    public UUID createSeatingplan(SeatingplanCreationRequest seatingplanCreationRequest) {
        var seatingplan = mapper.toSeatingplan(seatingplanCreationRequest);
        repository.persist(seatingplan);
        return seatingplan.getId();
    }
}
