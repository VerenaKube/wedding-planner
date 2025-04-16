import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import java.util.HashMap;
import java.util.Map;
import org.testcontainers.containers.MongoDBContainer;

public class MongoTestResource implements QuarkusTestResourceLifecycleManager {

  private MongoDBContainer mongoDBContainer;

  @Override
  public Map<String, String> start() {
    mongoDBContainer = new MongoDBContainer("mongo:6.0.5");
    mongoDBContainer.start();

    Map<String, String> config = new HashMap<>();
    config.put("quarkus.mongodb.connection-string", mongoDBContainer.getReplicaSetUrl());
    return config;
  }

  @Override
  public void stop() {
    mongoDBContainer.stop();
  }
}
