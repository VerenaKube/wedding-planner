package de.swf.ehv.seatingplan.persistence;

import de.swf.ehv.seatingplan.persistence.entities.Seatingplan;
import io.quarkus.mongodb.panache.PanacheMongoRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class SeatingplanRepository implements PanacheMongoRepositoryBase<Seatingplan, UUID> {}
