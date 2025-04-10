package de.swf.ehv.seatingplan.api;

import de.swf.ehv.planner.generated.api.SeatingplanApi;
import de.swf.ehv.planner.generated.api.model.SeatingplanCreationRequest;
import de.swf.ehv.planner.generated.api.model.SeatingplanDto;
import de.swf.ehv.seatingplan.SeatingplanService;
import jakarta.ws.rs.core.Response;
import java.util.UUID;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class SeatingplanResource implements SeatingplanApi {

  private final SeatingplanService service;

  @Override
  public Response getAllSeatingplans() {
    return Response.status(200).entity(service.getAllSeatingplans()).build();
  }

  @Override
  public Response createSeatingplan(SeatingplanCreationRequest seatingplanCreationRequest) {
    return Response.status(Response.Status.CREATED)
        .entity(service.createSeatingplan(seatingplanCreationRequest))
        .build();
  }

  @Override
  public Response getSeatingplanById(UUID id) {
    return Response.status(200).entity(service.getSeatingplanById(id)).build();
  }

  @Override
  public Response updateSeatingplan(UUID id, SeatingplanDto seatingplan) {
    // TODO add validation to check if the given id matches the id of the given seatingplan
    service.updateSeatingplan(seatingplan);
    return Response.status(204, "Seatingplan with id " + id + " successfully updated").build();
  }

  @Override
  public Response deleteSeatingplan(UUID id) {
    service.deleteSeatingplan(id);
    return Response.status(204, "Seatingplan with id " + id + " successfully deleted").build();
  }

  @Override
  public Response validateSeatingplan(UUID id) {
    return Response.status(200, "Seatingplan successfully validated")
        .entity(service.validateSeatingplan(id))
        .build();
  }

  @Override
  public Response generateSeatingplanSolution(UUID id) {
    return Response.status(200, "Seatingplan solution successfully created")
        .entity(service.generateSeatingplanSolution(id))
        .build();
  }
}
