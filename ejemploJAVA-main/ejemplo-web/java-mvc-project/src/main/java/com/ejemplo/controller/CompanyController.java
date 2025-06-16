package com.ejemplo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private JdbcTemplate jdbcTemplate;





    @GetMapping
    public List<Map<String, Object>> getAllCompanies() {
        String sql = "SELECT codigo_company, name_company, description_company FROM company";
        return jdbcTemplate.queryForList(sql);
    } 
    // Obtener compañía por código con versión y app_name
        @GetMapping("/{codigo}")
    public ResponseEntity<Map<String, Object>> getCompanyByCodigo(@PathVariable String codigo) {
        // Buscar la compañía por codigo_company (que es unique)
        String sqlCompany = "SELECT id_company, codigo_company, name_company, description_company FROM company WHERE codigo_company = ?";
        List<Map<String, Object>> companies = jdbcTemplate.queryForList(sqlCompany, codigo);

        if (companies.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> company = companies.get(0);
        Long idCompany = ((Number)company.get("id_company")).longValue();

        // Obtener la versión más reciente asociada a esta compañía
        String sqlVersion = 
            "SELECT v.version " +
            "FROM version v " +
            "JOIN version_company vc ON v.version_id = vc.version_id " +
            "WHERE vc.company_id = ? " +
            "ORDER BY v.version_id DESC";

        List<Map<String, Object>> versions = jdbcTemplate.queryForList(sqlVersion, idCompany);
        String version = versions.isEmpty() ? null : (String) versions.get(0).get("version");

        Map<String, Object> response = new HashMap<>();
        response.put("codigo_company", company.get("codigo_company"));
        response.put("name_company", company.get("name_company"));
        response.put("description_company", company.get("description_company"));
        response.put("version", version);

        return ResponseEntity.ok(response);
    }

    // Crear nueva compañía
    @PostMapping
    public ResponseEntity<String> createCompany(@RequestBody Map<String, Object> payload) {
        String sql = "INSERT INTO company (codigo_company, name_company, description_company) VALUES (?, ?, ?)";
        try {
            jdbcTemplate.update(sql,
                payload.get("codigo_company"),
                payload.get("name_company"),
                payload.get("description_company"));
            return ResponseEntity.ok("Company created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<String> updateCompany(@PathVariable String codigo, @RequestBody Map<String, Object> payload) {
        String sqlCheck = "SELECT COUNT(*) FROM company WHERE codigo_company = ?";
        Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, codigo);
        if (count == null || count == 0) {
            return ResponseEntity.notFound().build();
        }

        String sql = "UPDATE company SET name_company = ?, description_company = ? WHERE codigo_company = ?";
        try {
            jdbcTemplate.update(sql,
                payload.get("name_company"),
                payload.get("description_company"),
                codigo);
            return ResponseEntity.ok("Company updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    @DeleteMapping("/{codigo}")
    public ResponseEntity<String> deleteCompany(@PathVariable String codigo) {
        String sqlCheck = "SELECT COUNT(*) FROM company WHERE codigo_company = ?";
        Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, codigo);
        if (count == null || count == 0) {
            return ResponseEntity.notFound().build();
        }

        String sql = "DELETE FROM company WHERE codigo_company = ?";
        try {
            jdbcTemplate.update(sql, codigo);
            return ResponseEntity.ok("Company deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}
