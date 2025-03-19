package de.swf.ehv.planner;

import de.swf.ehv.planner.generated.api.PlannerApi;
import de.swf.ehv.planner.generated.api.model.Example;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PlannerResource implements PlannerApi {

    @Override
    public Response getExample() {
        return Response.status(200)
                .entity(Example.builder().content("Hello World").build())
                .build();
    }
}
