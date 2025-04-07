package de.swf.ehv.seatingplan.optimization;

import de.swf.ehv.seatingplan.persistence.entities.Seatingplan;
import de.swf.ehv.seatingplan.persistence.entities.SeatingplanSolution;
import jakarta.annotation.Nonnull;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;

@ApplicationScoped
@RequiredArgsConstructor
public class SeatingplanOptimizer {

  private final SeatingplanSolutionGenerator solutionGenerator;
  private final SeatingplanSolutionEvaluator seatingplanSolutionEvaluator;

  public SeatingplanSolution optimize(@Nonnull Seatingplan seatingplan) {
    var solutions = generateSolutions(seatingplan, 100);
    for (int i = 0; i < 20; i++) {
      var solutionRatings = rateSeatingplanSolutions(solutions);
      solutions = evolveSeatingplanSolutions(solutionRatings);
      solutions = mutateSeatingplanSolutions(solutions);
      solutions.addAll(generateSolutions(seatingplan, 100 - solutions.size()));
    }
    return findBestSeatingplanSolution(rateSeatingplanSolutions(solutions));
  }

  private List<SeatingplanSolution> generateSolutions(Seatingplan seatingplan, int amount) {
    var seatingplanSolutions = new ArrayList<SeatingplanSolution>();
    for (int i = 0; i < amount; i++) {
      seatingplanSolutions.add(solutionGenerator.generateSeatingplanSolution(seatingplan));
    }
    return seatingplanSolutions;
  }

  private List<Pair<SeatingplanSolution, Integer>> rateSeatingplanSolutions(
      List<SeatingplanSolution> seatingplanSolutions) {
    return seatingplanSolutions.stream()
        .map(
            solution ->
                Pair.of(
                    solution, seatingplanSolutionEvaluator.evaluateSeatingplanSolution(solution)))
        .toList();
  }

  private List<SeatingplanSolution> evolveSeatingplanSolutions(
      List<Pair<SeatingplanSolution, Integer>> solutionRatings) {
    return new ArrayList<>();
  }

  private List<SeatingplanSolution> mutateSeatingplanSolutions(
      List<SeatingplanSolution> seatingplanSolutions) {
    return new ArrayList<>();
  }

  private SeatingplanSolution findBestSeatingplanSolution(
      List<Pair<SeatingplanSolution, Integer>> solutionRatings) {
    return solutionRatings.stream()
        .max(Comparator.comparingInt(Pair::getValue))
        .orElseThrow()
        .getKey();
  }
}
