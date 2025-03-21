package de.swf.ehv.seatingplan;

import de.swf.ehv.planner.generated.api.SeatingplanApi;
import de.swf.ehv.planner.generated.api.model.Seatingplan;
import de.swf.ehv.planner.generated.api.model.SeatingplanCreationRequest;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@RequiredArgsConstructor
public class SeatingplanResource implements SeatingplanApi {

    private final SeatingplanService service;

    @Override
    public Response createSeatingplan(SeatingplanCreationRequest seatingplanCreationRequest) {
        // TODO implement
        return Response.status(Response.Status.CREATED)
                .entity(UUID.randomUUID())
                .build();
    }

    @Override
    public Response getSeatingplanById(UUID id) {
        // TODO implement
        return Response.status(404, "No seatingplan with id " + id + " found").build();
    }

    @Override
    public Response update(UUID id, Seatingplan seatingplan) {
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
