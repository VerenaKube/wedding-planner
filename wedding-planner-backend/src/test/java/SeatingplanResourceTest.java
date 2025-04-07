import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.MongoDBContainer;

@QuarkusTest
class SeatingplanResourceTest {

  private static final MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.5");

  @BeforeAll
  static void setUp() {
    mongoDBContainer.start();
    System.setProperty("quarkus.mongodb.connection-string", mongoDBContainer.getReplicaSetUrl());
  }

  @AfterAll
  static void tearDown() {
    mongoDBContainer.stop();
  }

  @Test
  void testCreateSeatingplan() {
    var seatingplanCreationRequest =
        """
        {
            "name": "First Example",
            "bride": "Verena",
            "groom": "Rene",
            "weddingDate": "2025-05-05"
        }
        """;
    var seatingplanId =
        RestAssured.given()
            .contentType(ContentType.JSON)
            .body(seatingplanCreationRequest)
            .when()
            .post("/seatingplans")
            .then()
            .statusCode(201)
            .extract()
            .body()
            .asString();

    Assertions.assertThat(seatingplanId).isNotNull();
  }
}
