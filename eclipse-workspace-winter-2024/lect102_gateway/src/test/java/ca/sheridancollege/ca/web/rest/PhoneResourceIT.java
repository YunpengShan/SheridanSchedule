package ca.sheridancollege.ca.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import ca.sheridancollege.ca.IntegrationTest;
import ca.sheridancollege.ca.domain.Phone;
import ca.sheridancollege.ca.repository.EntityManager;
import ca.sheridancollege.ca.repository.PhoneRepository;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link PhoneResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class PhoneResourceIT {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/phones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PhoneRepository phoneRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Phone phone;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Phone createEntity(EntityManager em) {
        Phone phone = new Phone().phone(DEFAULT_PHONE);
        return phone;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Phone createUpdatedEntity(EntityManager em) {
        Phone phone = new Phone().phone(UPDATED_PHONE);
        return phone;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Phone.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        phone = createEntity(em);
    }

    @Test
    void createPhone() throws Exception {
        int databaseSizeBeforeCreate = phoneRepository.findAll().collectList().block().size();
        // Create the Phone
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeCreate + 1);
        Phone testPhone = phoneList.get(phoneList.size() - 1);
        assertThat(testPhone.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    void createPhoneWithExistingId() throws Exception {
        // Create the Phone with an existing ID
        phone.setId(1L);

        int databaseSizeBeforeCreate = phoneRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllPhonesAsStream() {
        // Initialize the database
        phoneRepository.save(phone).block();

        List<Phone> phoneList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Phone.class)
            .getResponseBody()
            .filter(phone::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(phoneList).isNotNull();
        assertThat(phoneList).hasSize(1);
        Phone testPhone = phoneList.get(0);
        assertThat(testPhone.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    void getAllPhones() {
        // Initialize the database
        phoneRepository.save(phone).block();

        // Get all the phoneList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(phone.getId().intValue()))
            .jsonPath("$.[*].phone")
            .value(hasItem(DEFAULT_PHONE));
    }

    @Test
    void getPhone() {
        // Initialize the database
        phoneRepository.save(phone).block();

        // Get the phone
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, phone.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(phone.getId().intValue()))
            .jsonPath("$.phone")
            .value(is(DEFAULT_PHONE));
    }

    @Test
    void getNonExistingPhone() {
        // Get the phone
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingPhone() throws Exception {
        // Initialize the database
        phoneRepository.save(phone).block();

        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();

        // Update the phone
        Phone updatedPhone = phoneRepository.findById(phone.getId()).block();
        updatedPhone.phone(UPDATED_PHONE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPhone.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPhone))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
        Phone testPhone = phoneList.get(phoneList.size() - 1);
        assertThat(testPhone.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    void putNonExistingPhone() throws Exception {
        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();
        phone.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, phone.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPhone() throws Exception {
        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();
        phone.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPhone() throws Exception {
        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();
        phone.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePhoneWithPatch() throws Exception {
        // Initialize the database
        phoneRepository.save(phone).block();

        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();

        // Update the phone using partial update
        Phone partialUpdatedPhone = new Phone();
        partialUpdatedPhone.setId(phone.getId());

        partialUpdatedPhone.phone(UPDATED_PHONE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPhone.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPhone))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
        Phone testPhone = phoneList.get(phoneList.size() - 1);
        assertThat(testPhone.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    void fullUpdatePhoneWithPatch() throws Exception {
        // Initialize the database
        phoneRepository.save(phone).block();

        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();

        // Update the phone using partial update
        Phone partialUpdatedPhone = new Phone();
        partialUpdatedPhone.setId(phone.getId());

        partialUpdatedPhone.phone(UPDATED_PHONE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPhone.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPhone))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
        Phone testPhone = phoneList.get(phoneList.size() - 1);
        assertThat(testPhone.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    void patchNonExistingPhone() throws Exception {
        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();
        phone.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, phone.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPhone() throws Exception {
        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();
        phone.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPhone() throws Exception {
        int databaseSizeBeforeUpdate = phoneRepository.findAll().collectList().block().size();
        phone.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(phone))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Phone in the database
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePhone() {
        // Initialize the database
        phoneRepository.save(phone).block();

        int databaseSizeBeforeDelete = phoneRepository.findAll().collectList().block().size();

        // Delete the phone
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, phone.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Phone> phoneList = phoneRepository.findAll().collectList().block();
        assertThat(phoneList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
