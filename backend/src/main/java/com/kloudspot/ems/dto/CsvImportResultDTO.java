package com.kloudspot.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Summary report returned following a CSV bulk import operation")
public class CsvImportResultDTO {

    @Schema(description = "Total lines processed from CSV", example = "12")
    private int totalRows;

    @Schema(description = "New employee records successfully inserted", example = "10")
    private int importedCount;

    @Schema(description = "Existing employee records successfully updated", example = "2")
    private int updatedCount;

    @Schema(description = "Rows skipped due to validation or parsing errors", example = "0")
    private int skippedCount;

    @Builder.Default
    @Schema(description = "List of warning and error messages per invalid row")
    private List<String> errors = new ArrayList<>();
}
