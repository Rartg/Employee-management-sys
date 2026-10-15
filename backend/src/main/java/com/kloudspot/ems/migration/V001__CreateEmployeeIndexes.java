package com.kloudspot.ems.migration;

import com.kloudspot.ems.model.Employee;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;

/**
 * Mongock Migration 001: Establishes unique and query performance indexes.
 */
@Slf4j
@ChangeUnit(id = "v001-create-employee-indexes", order = "001", author = "samarth")
public class V001__CreateEmployeeIndexes {

    private final MongoTemplate mongoTemplate;

    public V001__CreateEmployeeIndexes(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Execution
    public void execution() {
        log.info("[MONGOCK MIGRATION 001] Ensuring unique and search indexes on 'employees' collection...");

        try {
            mongoTemplate.indexOps(Employee.class)
                    .ensureIndex(new Index().on("employeeId", Sort.Direction.ASC).unique());
        } catch (Exception e) {
            log.debug("Index 'employeeId' already present: {}", e.getMessage());
        }

        try {
            mongoTemplate.indexOps(Employee.class)
                    .ensureIndex(new Index().on("email", Sort.Direction.ASC).unique());
        } catch (Exception e) {
            log.debug("Index 'email' already present: {}", e.getMessage());
        }

        try {
            mongoTemplate.indexOps(Employee.class)
                    .ensureIndex(new Index().on("department", Sort.Direction.ASC));
            mongoTemplate.indexOps(Employee.class)
                    .ensureIndex(new Index().on("employmentStatus", Sort.Direction.ASC));
        } catch (Exception e) {
            log.debug("Search indexes already present: {}", e.getMessage());
        }

        log.info("[MONGOCK MIGRATION 001] Index migration completed successfully.");
    }

    @RollbackExecution
    public void rollback() {
        log.info("[MONGOCK ROLLBACK 001] Rolling back indexes...");
        try {
            mongoTemplate.indexOps(Employee.class).dropIndex("employeeId");
            mongoTemplate.indexOps(Employee.class).dropIndex("email");
        } catch (Exception ignored) {
        }
    }
}
