package com.kloudspot.ems.repository;

import com.kloudspot.ems.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
    Optional<Employee> findByEmployeeId(String employeeId);
    Optional<Employee> findByEmployeeIdIgnoreCase(String employeeId);
    Optional<Employee> findByEmailIgnoreCase(String email);
    Optional<Employee> findByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, String id);

    void deleteByEmployeeId(String employeeId);
    boolean existsByEmployeeIdAndIdNot(String employeeId, String id);
}
