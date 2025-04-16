import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
class SeatingplanResourceTest {

  @Test
  void testCreateSeatingplan() throws IOException {
    var seatingplanCreationRequest =
        Files.readString(
            Path.of("src/test/resources", "postSeatingplanRequest.json"), StandardCharsets.UTF_8);
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
            .jsonPath()
            .getString("");
    Assertions.assertThat(seatingplanId).isNotNull();

    RestAssured.given()
        .contentType(ContentType.JSON)
        .when()
        .get("/seatingplans/{id}", seatingplanId)
        .then()
        .statusCode(200);

    var updateSeatingplanRequest =
        Files.readString(
                Path.of("src/test/resources", "updateSeatingplanRequest.json"),
                StandardCharsets.UTF_8)
            .replace("seatingplanId", seatingplanId);
    RestAssured.given()
        .contentType(ContentType.JSON)
        .body(updateSeatingplanRequest)
        .when()
        .put("/seatingplans/{id}", seatingplanId)
        .then()
        .statusCode(204);
  }
}
