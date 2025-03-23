package de.swf.ehv.seatingplan.api;

import de.swf.ehv.planner.generated.api.SeatingplanApi;
import de.swf.ehv.planner.generated.api.model.SeatingplanCreationRequest;
import de.swf.ehv.planner.generated.api.model.SeatingplanDto;
import de.swf.ehv.seatingplan.SeatingplanService;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@RequiredArgsConstructor
public class SeatingplanResource implements SeatingplanApi {

    private final SeatingplanService service;

    @Override
    public Response createSeatingplan(SeatingplanCreationRequest seatingplanCreationRequest) {
        return Response.status(Response.Status.CREATED)
                .entity(service.createSeatingplan(seatingplanCreationRequest))
                .build();
    }

    @Override
    public Response getSeatingplanById(UUID id) {
        // TODO implement
        return Response.status(404, "No seatingplan with id " + id + " found").build();
    }

    @Override
    public Response update(UUID id, SeatingplanDto seatingplan) {
        // TODO implement
        return Response.status(404, "No seatingplan with id " + id + " found").build();
    }

    @Override
    public Response deleteSeatingplan(UUID id) {
        // TODO implement
        return Response.status(404, "No seatingplan with id " + id + " found").build();
    }

    @Override
    public Response validateSeatingplan(UUID id) {
        // TODO implement
        return Response.status(404, "No seatingplan with id " + id + " found").build();
    }
}
