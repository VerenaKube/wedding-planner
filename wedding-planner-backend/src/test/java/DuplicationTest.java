import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

public class DuplicationTest {

  @Test
  public void testListComparison() {
    var list1 = List.of("a", "b", "c");
    var list2 = List.of("d", "e", "f");

    Assertions.assertThat(list1.stream().anyMatch(list2::contains)).isFalse();
    Assertions.assertThat(list1.stream().noneMatch(list2::contains)).isTrue();
  }
}
