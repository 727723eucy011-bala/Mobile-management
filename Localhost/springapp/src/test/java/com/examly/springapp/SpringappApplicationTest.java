package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import java.io.File;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappPlanTests {

    @Autowired
    private MockMvc mockMvc;

    // ---------- Core API Tests ----------
    @Order(1)
    @Test
    void AddPlanReturns200() throws Exception {
        String planData = """
                {
                    "planName": "Unlimited 399",
                    "type": "Prepaid",
                    "price": 399,
                    "validity": 28,
                    "dataLimit": "1.5GB/day"
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/plans/addPlan")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(planData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
    }

    @Order(2)
    @Test
    void GetAllPlansReturnsArray() throws Exception {
        mockMvc.perform(get("/api/plans/allPlans")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(3)
    @Test
    void GetPlansByTypeReturns200() throws Exception {
        mockMvc.perform(get("/api/plans/byType")
                        .with(jwt())
                        .param("type", "Prepaid")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].planName").exists())
                .andReturn();
    }

    @Order(4)
    @Test
    void GetPlansSortedByPriceReturns200() throws Exception {
        mockMvc.perform(get("/api/plans/sortedByPrice")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    // ---------- Project Structure Tests ----------
    @Test
    void ControllerDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void PlanControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/PlanController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void ModelDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void PlanModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Plan.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void RepositoryDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ServiceDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void PlanServiceClassExists() {
        checkClassExists("com.examly.springapp.service.PlanService");
    }

    @Test
    void PlanModelClassExists() {
        checkClassExists("com.examly.springapp.model.Plan");
    }

    @Test
    void PlanModelHasPlanNameField() {
        checkFieldExists("com.examly.springapp.model.Plan", "planName");
    }

    @Test
    void PlanModelHasTypeField() {
        checkFieldExists("com.examly.springapp.model.Plan", "type");
    }

    @Test
    void PlanModelHasPriceField() {
        checkFieldExists("com.examly.springapp.model.Plan", "price");
    }

    @Test
    void PlanModelHasValidityField() {
        checkFieldExists("com.examly.springapp.model.Plan", "validity");
    }

    @Test
    void PlanModelHasDataLimitField() {
        checkFieldExists("com.examly.springapp.model.Plan", "dataLimit");
    }

    @Test
    void PlanRepoExtendsJpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.PlanRepository", "org.springframework.data.jpa.repository.JpaRepository");
    }
    @Test
    void PlanNotFoundExceptionClassExists() {
        checkClassExists("com.examly.springapp.exception.PlanNotFoundException");
    }

    @Test
    void PlanNotFoundExceptionExtendsRuntimeException() {
        try {
            Class<?> clazz = Class.forName("com.examly.springapp.exception.PlanNotFoundException");
            assertTrue(RuntimeException.class.isAssignableFrom(clazz),
                    "PlanNotFoundException should extend RuntimeException");
        } catch (ClassNotFoundException e) {
            fail("PlanNotFoundException class does not exist.");
        }
    }

    // ---------- Helpers ----------
    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }

    private void checkClassHasAnnotation(String className, String annotationName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> annotationClazz = Class.forName(annotationName);
            assertTrue(clazz.isAnnotationPresent((Class<? extends java.lang.annotation.Annotation>) annotationClazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or annotation " + annotationName + " does not exist.");
        }
    }
}
