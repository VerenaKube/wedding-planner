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
public class SeatingplanSolutionOptimizer {

  private static final int ALGORITHM_SIZE = 100;
  private static final int ALGORITHM_ITERATIONS = 20;

  private final SeatingplanSolutionGenerator solutionGenerator;
  private final SeatingplanSolutionEvaluator seatingplanSolutionEvaluator;
  private final SeatingplanSolutionEvolver seatingplanEvolver;
  private final SeatingplanSolutionMutator seatingplanMutator;

  public SeatingplanSolution optimize(@Nonnull Seatingplan seatingplan) {
    var solutions = generateSolutions(seatingplan, ALGORITHM_SIZE);
    for (int i = 0; i < ALGORITHM_ITERATIONS; i++) {
      var solutionRatings = rateSeatingplanSolutions(solutions, seatingplan);
      solutions = evolveSeatingplanSolutions(solutionRatings);
      solutions.addAll(mutateSeatingplanSolutions(seatingplan, solutions, ALGORITHM_SIZE));
      solutions.addAll(generateSolutions(seatingplan, ALGORITHM_SIZE - solutions.size()));
    }
    return findBestSeatingplanSolution(rateSeatingplanSolutions(solutions, seatingplan));
  }

  private List<SeatingplanSolution> generateSolutions(Seatingplan seatingplan, int amount) {
    var seatingplanSolutions = new ArrayList<SeatingplanSolution>();
    for (int i = 0; i < amount; i++) {
      seatingplanSolutions.add(solutionGenerator.generateSeatingplanSolution(seatingplan));
    }
    return seatingplanSolutions;
  }

  private List<Pair<SeatingplanSolution, Integer>> rateSeatingplanSolutions(
      List<SeatingplanSolution> seatingplanSolutions, Seatingplan seatingplan) {
    return seatingplanSolutions.stream()
        .map(
            solution ->
                Pair.of(
                    solution,
                    seatingplanSolutionEvaluator.evaluateSeatingplanSolution(
                        solution, seatingplan)))
        .toList();
  }

  private List<SeatingplanSolution> evolveSeatingplanSolutions(
      List<Pair<SeatingplanSolution, Integer>> solutionRatings) {
    return seatingplanEvolver.evolveSeatingplanSolutions(solutionRatings);
  }

  private List<SeatingplanSolution> mutateSeatingplanSolutions(
      Seatingplan seatingplan, List<SeatingplanSolution> seatingplanSolutions, int amount) {
    var solutionFragments =
        seatingplanMutator.mutateSeatingplanSolutions(seatingplanSolutions, amount);
    return solutionFragments.stream()
        .map(
            fragment ->
                solutionGenerator.generateSeatingplanSolution(seatingplan, fragment.tables()))
        .toList();
  }

  private SeatingplanSolution findBestSeatingplanSolution(
      List<Pair<SeatingplanSolution, Integer>> solutionRatings) {
    return solutionRatings.stream()
        .max(Comparator.comparingInt(Pair::getValue))
        .orElseThrow()
        .getKey();
  }
}
