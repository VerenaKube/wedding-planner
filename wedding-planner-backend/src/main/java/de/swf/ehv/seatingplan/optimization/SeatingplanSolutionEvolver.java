package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.Pair;

@ApplicationScoped
public class SeatingplanSolutionEvolver {

  public List<SeatingplanSolution> evolveSeatingplanSolutions(
      List<Pair<SeatingplanSolution, Integer>> solutionRatings) {
    var maxRating =
        solutionRatings.stream().map(Pair::getRight).max(Integer::compareTo).orElseThrow();
    return solutionRatings.stream()
        .filter(pair -> seatingplanHasEvolved(pair.getRight(), maxRating))
        .map(Pair::getLeft)
        .collect(Collectors.toList());
  }

  private boolean seatingplanHasEvolved(Integer rating, Integer maxValue) {
    var comparedValue = ThreadLocalRandom.current().nextInt(0, maxValue + 1);
    return rating >= comparedValue;
  }
}
