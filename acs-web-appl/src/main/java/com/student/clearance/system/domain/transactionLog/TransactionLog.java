package com.student.clearance.system.domain.transactionLog;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class TransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("studentId")
    private String studentId;

    @JsonProperty("departmentId")
    private Long departmentId;

    @JsonProperty("transactionType")
    private String transactionType;

    @JsonProperty("details")
    private String details;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
}
