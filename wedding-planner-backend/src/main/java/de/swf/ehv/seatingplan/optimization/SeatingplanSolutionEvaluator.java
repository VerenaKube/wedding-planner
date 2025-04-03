package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import jakarta.annotation.Nonnull;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SeatingplanSolutionEvaluator {

    public Integer evaluateSeatingplanSolution(@Nonnull SeatingplanSolution seatingplanSolution) {
        return 1;
    }
}
