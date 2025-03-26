package de.swf.ehv.seatingplan.persistence.entities;

import java.util.UUID;

public record SeatingRule(UUID id, RuleType ruleType, GuestMinimal firstGuest, GuestMinimal secondGuest) {}
